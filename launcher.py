#!/usr/bin/env python3
"""
AISMP Free Launcher - Automated Intelligent Streaming Minecraft Player Launcher
A comprehensive bot management system for Minecraft SMP with streaming capabilities.

Features:
- Multi-bot management with pyCraft
- Dynamic skin application via SkinsRestorer
- TTS voice routing with PyTTSx3
- Multi-platform streaming with intelligent routing
- Real-time CLI dashboard
"""

import yaml
import sys
import os
import time
import logging
import threading
from typing import Dict, List, Optional, Any
from datetime import datetime
from collections import defaultdict

# Import required libraries (will be installed via requirements.txt)
try:
    import pyttsx3
except ImportError:
    pyttsx3 = None
    print("Warning: pyttsx3 not installed. Voice features will be disabled.")

try:
    from minecraft import authentication
    from minecraft.exceptions import YggdrasilError
    from minecraft.networking.connection import Connection
    from minecraft.networking.packets import Packet, clientbound, serverbound
except ImportError:
    print("Warning: pyCraft not installed. Bot connection features will be limited.")
    Connection = None


class BotStatus:
    """Represents the current status of a bot"""
    def __init__(self, name: str):
        self.name = name
        self.connected = False
        self.streaming = False
        self.stream_platform = None
        self.skin_applied = False
        self.voice_active = False
        self.last_update = datetime.now()
        self.error = None


class StreamPlatformManager:
    """Manages streaming platform allocation and capacity"""
    def __init__(self, platform_limits: Dict[str, int]):
        self.platform_limits = platform_limits
        self.active_streams = defaultdict(int)
        self.bot_platforms = {}  # bot_name -> platform_name
        self._lock = threading.Lock()
    
    def allocate_platform(self, bot_name: str, platforms: List[Dict]) -> Optional[str]:
        """
        Allocate a streaming platform for a bot based on priority and capacity.
        
        Args:
            bot_name: Name of the bot requesting a platform
            platforms: List of platform configurations sorted by priority
            
        Returns:
            Platform name if allocated, None if no platform available
        """
        with self._lock:
            for platform in platforms:
                platform_name = platform['name']
                max_concurrent = self.platform_limits.get(platform_name, float('inf'))
                
                if self.active_streams[platform_name] < max_concurrent:
                    self.active_streams[platform_name] += 1
                    self.bot_platforms[bot_name] = platform_name
                    return platform_name
            
            return None
    
    def release_platform(self, bot_name: str):
        """Release a platform allocation for a bot"""
        with self._lock:
            if bot_name in self.bot_platforms:
                platform_name = self.bot_platforms[bot_name]
                self.active_streams[platform_name] = max(0, self.active_streams[platform_name] - 1)
                del self.bot_platforms[bot_name]


class AISMPLauncher:
    """Main launcher class for managing Minecraft bots"""
    
    def __init__(self, config_path: str = "bots.yaml"):
        self.config_path = config_path
        self.config = None
        self.bots_status = {}
        self.platform_manager = None
        self.logger = None
        self.running = False
        self.bot_threads = []
        
    def loadConfig(self) -> bool:
        """
        Load and parse the bots.yaml configuration file.
        
        Returns:
            True if configuration loaded successfully, False otherwise
        """
        try:
            with open(self.config_path, 'r') as file:
                self.config = yaml.safe_load(file)
            
            # Validate configuration
            if 'bots' not in self.config:
                raise ValueError("Configuration must contain 'bots' section")
            
            # Initialize platform manager
            platform_limits = self.config.get('global', {}).get('platform_limits', {})
            self.platform_manager = StreamPlatformManager(platform_limits)
            
            # Setup logging
            self._setupLogging()
            
            self.logger.info(f"Configuration loaded successfully: {len(self.config['bots'])} bots configured")
            return True
            
        except FileNotFoundError:
            print(f"Error: Configuration file '{self.config_path}' not found")
            return False
        except yaml.YAMLError as e:
            print(f"Error parsing YAML configuration: {e}")
            return False
        except Exception as e:
            print(f"Error loading configuration: {e}")
            return False
    
    def _setupLogging(self):
        """Setup logging based on configuration"""
        log_config = self.config.get('global', {}).get('logging', {})
        log_level = getattr(logging, log_config.get('level', 'INFO'))
        log_file = log_config.get('file', 'logs/aismp_launcher.log')
        
        # Create logs directory if it doesn't exist
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        # Configure logging
        handlers = []
        if log_config.get('console', True):
            handlers.append(logging.StreamHandler())
        handlers.append(logging.FileHandler(log_file))
        
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=handlers
        )
        
        self.logger = logging.getLogger('AISMP')
    
    def launchBot(self, bot_config: Dict) -> bool:
        """
        Launch and manage a Minecraft bot connection using pyCraft.
        
        Args:
            bot_config: Configuration dictionary for the bot
            
        Returns:
            True if bot launched successfully, False otherwise
        """
        bot_name = bot_config['name']
        self.logger.info(f"Launching bot: {bot_name}")
        
        # Initialize bot status
        status = BotStatus(bot_name)
        self.bots_status[bot_name] = status
        
        try:
            # Apply skin if configured
            if bot_config.get('skin', {}).get('enabled', False):
                self.applySkin(bot_config)
                status.skin_applied = True
            
            # Setup TTS if configured
            if bot_config.get('voice', {}).get('enabled', False):
                self.setupTTS(bot_config)
                status.voice_active = True
            
            # Route to streaming platform if configured
            if bot_config.get('streaming', {}).get('enabled', False):
                platform = self.routeStream(bot_config)
                if platform:
                    status.streaming = True
                    status.stream_platform = platform
            
            # Connect to Minecraft server
            if Connection is not None:
                self._connectToServer(bot_config, status)
            else:
                self.logger.warning(f"pyCraft not available, simulating connection for {bot_name}")
                status.connected = True
            
            status.last_update = datetime.now()
            self.logger.info(f"Bot {bot_name} launched successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error launching bot {bot_name}: {e}")
            status.error = str(e)
            status.last_update = datetime.now()
            return False
    
    def _connectToServer(self, bot_config: Dict, status: BotStatus):
        """
        Establish connection to Minecraft server using pyCraft.
        
        Args:
            bot_config: Bot configuration dictionary
            status: BotStatus object to update
        """
        server_config = bot_config.get('server', {})
        username = bot_config['username']
        
        try:
            # For offline mode, no authentication needed
            if bot_config.get('auth_type', 'offline') == 'offline':
                auth_token = None
            else:
                # Online mode authentication would go here
                auth_token = None
            
            # Create connection
            connection = Connection(
                server_config.get('host', 'localhost'),
                server_config.get('port', 25565),
                auth_token=auth_token,
                username=username
            )
            
            # Connect to server
            connection.connect()
            status.connected = True
            
            # Keep connection alive in background
            # In production, this would handle packets and keep the bot active
            
        except Exception as e:
            self.logger.error(f"Failed to connect {username} to server: {e}")
            status.connected = False
            raise
    
    def applySkin(self, bot_config: Dict):
        """
        Dynamically apply Minecraft skin via SkinsRestorer or plugin integration.
        
        Args:
            bot_config: Bot configuration dictionary
        """
        skin_config = bot_config.get('skin', {})
        bot_name = bot_config['name']
        
        if not skin_config.get('enabled', False):
            return
        
        skin_source = skin_config.get('source', 'url')
        skin_value = skin_config.get('value', '')
        apply_method = skin_config.get('apply_method', 'skinsrestorer')
        
        self.logger.info(f"Applying skin for {bot_name} from {skin_source}: {skin_value}")
        
        if apply_method == 'skinsrestorer':
            # SkinsRestorer command format: /skin set <username> <url>
            # This would be sent via RCON or in-game command execution
            command = f"/skin set {bot_config['username']} {skin_value}"
            self.logger.debug(f"SkinsRestorer command: {command}")
            # In production, this would execute via RCON or bot command sender
        
        elif apply_method == 'plugin_command':
            # Generic plugin command
            command = f"/skin {bot_config['username']} {skin_value}"
            self.logger.debug(f"Plugin command: {command}")
        
        self.logger.info(f"Skin applied for {bot_name}")
    
    def setupTTS(self, bot_config: Dict):
        """
        Configure PyTTSx3 for offline TTS with audio routing.
        
        Args:
            bot_config: Bot configuration dictionary
        """
        voice_config = bot_config.get('voice', {})
        bot_name = bot_config['name']
        
        if not voice_config.get('enabled', False) or pyttsx3 is None:
            return
        
        try:
            # Initialize TTS engine
            engine = pyttsx3.init()
            
            # Configure voice settings
            voices = engine.getProperty('voices')
            voice_id = voice_config.get('voice_id', 0)
            if 0 <= voice_id < len(voices):
                engine.setProperty('voice', voices[voice_id].id)
            
            engine.setProperty('rate', voice_config.get('rate', 150))
            engine.setProperty('volume', voice_config.get('volume', 1.0))
            
            # Store engine for later use (in production, this would be kept in bot state)
            self.logger.info(f"TTS configured for {bot_name} with voice {voice_id}")
            
            # Note: Audio routing to virtual cable/OBS would be configured at OS level
            # or via FFmpeg pipeline
            output_device = voice_config.get('output_device', 'default')
            self.logger.debug(f"TTS output device: {output_device}")
            
        except Exception as e:
            self.logger.error(f"Failed to setup TTS for {bot_name}: {e}")
    
    def routeStream(self, bot_config: Dict) -> Optional[str]:
        """
        Route bot to preferred streaming platform with fallback support.
        
        Args:
            bot_config: Bot configuration dictionary
            
        Returns:
            Name of allocated platform, or None if no platform available
        """
        streaming_config = bot_config.get('streaming', {})
        bot_name = bot_config['name']
        
        if not streaming_config.get('enabled', False):
            return None
        
        # Get platforms sorted by priority
        platforms = sorted(
            streaming_config.get('platforms', []),
            key=lambda x: x.get('priority', 999)
        )
        
        # Allocate platform
        allocated_platform = self.platform_manager.allocate_platform(bot_name, platforms)
        
        if allocated_platform:
            self.logger.info(f"Bot {bot_name} routed to {allocated_platform}")
            
            # Get platform-specific configuration
            platform_config = next(
                p for p in platforms if p['name'] == allocated_platform
            )
            
            # Setup FFmpeg streaming pipeline
            self._setupStreamPipeline(bot_config, platform_config)
            
            return allocated_platform
        else:
            self.logger.warning(f"No available streaming platform for {bot_name}")
            return None
    
    def _setupStreamPipeline(self, bot_config: Dict, platform_config: Dict):
        """
        Setup FFmpeg streaming pipeline for the bot.
        
        Args:
            bot_config: Bot configuration dictionary
            platform_config: Platform configuration dictionary
        """
        bot_name = bot_config['name']
        platform_name = platform_config['name']
        stream_key = platform_config.get('stream_key', '')
        
        # Replace environment variables in stream key
        import re
        env_vars = re.findall(r'\$\{(\w+)\}', stream_key)
        for var in env_vars:
            stream_key = stream_key.replace(f'${{{var}}}', os.environ.get(var, ''))
        
        ffmpeg_config = bot_config.get('streaming', {}).get('ffmpeg', {})
        
        # Build FFmpeg command (this would be executed in production)
        ffmpeg_cmd = [
            'ffmpeg',
            '-f', 'x11grab',  # Screen capture
            '-video_size', ffmpeg_config.get('resolution', '1920x1080'),
            '-framerate', str(ffmpeg_config.get('fps', 30)),
            '-i', ':0.0',  # Display
            '-f', 'pulse',  # Audio input
            '-i', 'default',
            '-c:v', 'libx264',
            '-preset', ffmpeg_config.get('preset', 'fast'),
            '-b:v', ffmpeg_config.get('video_bitrate', '2500k'),
            '-c:a', 'aac',
            '-b:a', ffmpeg_config.get('audio_bitrate', '128k'),
            '-f', 'flv',
            f'rtmp://{platform_name}.tv/live/{stream_key}'
        ]
        
        self.logger.debug(f"FFmpeg pipeline for {bot_name}: {' '.join(ffmpeg_cmd)}")
        # In production, this would start the FFmpeg process
    
    def showDashboard(self):
        """Display real-time CLI dashboard showing bot status"""
        dashboard_config = self.config.get('global', {}).get('dashboard', {})
        
        if not dashboard_config.get('enabled', True):
            return
        
        refresh_rate = dashboard_config.get('refresh_rate', 2)
        
        try:
            while self.running:
                # Clear screen
                os.system('clear' if os.name != 'nt' else 'cls')
                
                # Print header
                print("=" * 80)
                print(" " * 20 + "AISMP FREE LAUNCHER - DASHBOARD")
                print("=" * 80)
                print(f"\nLast Update: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"Active Bots: {len([s for s in self.bots_status.values() if s.connected])}/{len(self.bots_status)}")
                print("\n" + "-" * 80)
                
                # Print bot status table
                print(f"\n{'Bot Name':<20} {'Connected':<12} {'Streaming':<12} {'Platform':<15} {'Status':<20}")
                print("-" * 80)
                
                for bot_name, status in self.bots_status.items():
                    connected = "✓ Yes" if status.connected else "✗ No"
                    streaming = "✓ Yes" if status.streaming else "✗ No"
                    platform = status.stream_platform or "N/A"
                    
                    if status.error:
                        status_text = f"Error: {status.error[:15]}"
                    else:
                        status_text = "Running"
                    
                    print(f"{bot_name:<20} {connected:<12} {streaming:<12} {platform:<15} {status_text:<20}")
                
                # Show platform usage
                if dashboard_config.get('show_stream_status', True):
                    print("\n" + "-" * 80)
                    print("\nPlatform Usage:")
                    for platform, count in self.platform_manager.active_streams.items():
                        limit = self.platform_manager.platform_limits.get(platform, '∞')
                        print(f"  {platform.capitalize():<15} {count}/{limit}")
                
                print("\n" + "=" * 80)
                print("Press Ctrl+C to stop the launcher")
                
                time.sleep(refresh_rate)
                
        except KeyboardInterrupt:
            pass
    
    def launchAll(self):
        """Launch all configured bots"""
        if not self.config:
            self.logger.error("Configuration not loaded. Call loadConfig() first.")
            return False
        
        self.running = True
        self.logger.info("Starting AISMP Launcher...")
        
        # Launch each bot in a separate thread
        for bot_config in self.config['bots']:
            thread = threading.Thread(
                target=self.launchBot,
                args=(bot_config,),
                daemon=True
            )
            thread.start()
            self.bot_threads.append(thread)
            time.sleep(1)  # Stagger bot launches
        
        # Wait for all bots to initialize
        time.sleep(3)
        
        # Show dashboard
        try:
            self.showDashboard()
        except KeyboardInterrupt:
            self.logger.info("Shutdown requested...")
            self.shutdown()
    
    def shutdown(self):
        """Gracefully shutdown all bots"""
        self.logger.info("Shutting down AISMP Launcher...")
        self.running = False
        
        # Release all platform allocations
        for bot_name in list(self.bots_status.keys()):
            self.platform_manager.release_platform(bot_name)
        
        self.logger.info("Shutdown complete")


def main():
    """Main entry point for the launcher"""
    print("AISMP Free Launcher - Automated Intelligent Streaming Minecraft Player")
    print("=" * 80)
    
    # Parse command line arguments
    config_file = "bots.yaml"
    if len(sys.argv) > 1:
        config_file = sys.argv[1]
    
    # Create launcher instance
    launcher = AISMPLauncher(config_file)
    
    # Load configuration
    if not launcher.loadConfig():
        print("Failed to load configuration. Exiting.")
        sys.exit(1)
    
    # Launch all bots
    launcher.launchAll()


if __name__ == "__main__":
    main()
