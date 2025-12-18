#!/usr/bin/env python3
"""
AISMP Free Launcher - Quick Start Example
Demonstrates basic usage of the launcher with minimal configuration
"""

import os
import sys
from launcher import AISMPLauncher

def setup_example_environment():
    """Setup example environment variables for testing"""
    # Set example stream keys (use real ones in production)
    os.environ.setdefault('TWITCH_STREAM_KEY_1', 'example_twitch_key_1')
    os.environ.setdefault('TWITCH_STREAM_KEY_2', 'example_twitch_key_2')
    os.environ.setdefault('YOUTUBE_STREAM_KEY_1', 'example_youtube_key_1')
    os.environ.setdefault('YOUTUBE_STREAM_KEY_2', 'example_youtube_key_2')
    os.environ.setdefault('YOUTUBE_STREAM_KEY_3', 'example_youtube_key_3')
    os.environ.setdefault('TWITCH_STREAM_KEY_3', 'example_twitch_key_3')
    os.environ.setdefault('TIKTOK_STREAM_KEY_1', 'example_tiktok_key_1')

def example_single_bot():
    """Example: Launch a single bot"""
    print("Example 1: Launching a single bot\n")
    
    launcher = AISMPLauncher('bots.yaml')
    
    if launcher.loadConfig():
        # Launch just the first bot
        first_bot = launcher.config['bots'][0]
        success = launcher.launchBot(first_bot)
        
        if success:
            print(f"\n✓ Bot '{first_bot['name']}' launched successfully!")
            print(f"  - Connected: {launcher.bots_status[first_bot['name']].connected}")
            print(f"  - Streaming: {launcher.bots_status[first_bot['name']].streaming}")
            print(f"  - Platform: {launcher.bots_status[first_bot['name']].stream_platform}")
        else:
            print(f"\n✗ Failed to launch bot '{first_bot['name']}'")

def example_platform_routing():
    """Example: Demonstrate platform routing and capacity management"""
    print("\nExample 2: Platform routing and capacity management\n")
    
    launcher = AISMPLauncher('bots.yaml')
    
    if launcher.loadConfig():
        print("Platform Limits:")
        for platform, limit in launcher.platform_manager.platform_limits.items():
            print(f"  {platform}: {limit} concurrent streams")
        
        print("\nLaunching bots and observing platform allocation:\n")
        
        for bot_config in launcher.config['bots']:
            launcher.launchBot(bot_config)
            bot_name = bot_config['name']
            status = launcher.bots_status[bot_name]
            
            if status.streaming:
                print(f"✓ {bot_name} → {status.stream_platform}")
            else:
                print(f"✗ {bot_name} → No platform available")
        
        print("\nCurrent platform usage:")
        for platform, count in launcher.platform_manager.active_streams.items():
            limit = launcher.platform_manager.platform_limits.get(platform, '∞')
            print(f"  {platform}: {count}/{limit}")

def example_configuration_access():
    """Example: Accessing and displaying configuration"""
    print("\nExample 3: Configuration access\n")
    
    launcher = AISMPLauncher('bots.yaml')
    
    if launcher.loadConfig():
        print(f"Total bots configured: {len(launcher.config['bots'])}\n")
        
        for bot in launcher.config['bots']:
            print(f"Bot: {bot['name']}")
            print(f"  Username: {bot['username']}")
            print(f"  Server: {bot['server']['host']}:{bot['server']['port']}")
            print(f"  Skin enabled: {bot.get('skin', {}).get('enabled', False)}")
            print(f"  Voice enabled: {bot.get('voice', {}).get('enabled', False)}")
            print(f"  Streaming enabled: {bot.get('streaming', {}).get('enabled', False)}")
            
            if bot.get('streaming', {}).get('enabled'):
                platforms = bot['streaming'].get('platforms', [])
                platform_names = [p['name'] for p in platforms]
                print(f"  Platforms: {', '.join(platform_names)}")
            print()

def main():
    """Run all examples"""
    print("=" * 80)
    print(" " * 25 + "AISMP LAUNCHER EXAMPLES")
    print("=" * 80)
    
    # Setup example environment
    setup_example_environment()
    
    # Run examples
    try:
        example_configuration_access()
        print("\n" + "=" * 80 + "\n")
        
        example_single_bot()
        print("\n" + "=" * 80 + "\n")
        
        example_platform_routing()
        print("\n" + "=" * 80 + "\n")
        
    except Exception as e:
        print(f"\nError running examples: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
