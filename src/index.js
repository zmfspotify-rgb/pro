#!/usr/bin/env node

/**
 * AvatarOS - AI-Powered Minecraft Bot System
 * Advanced AI bots with memory, learning, and dynamic plugin/mod support
 */

const path = require('path');
const fs = require('fs');
const BotManager = require('./BotManager');
const StreamScheduler = require('./StreamScheduler');
const VoiceSystem = require('./VoiceSystem');
const TwitchChatHandler = require('./TwitchChatHandler');

class AvatarOS {
  constructor() {
    this.configPath = path.join(__dirname, '../config/config.json');
    this.version = require('../package.json').version;
    this.botManager = null;
    this.streamScheduler = null;
    this.voiceSystem = null;
    this.chatHandler = null;
  }

  async start() {
    // Check if user wants to open config editor
    if (process.argv.includes('--config') || process.argv.includes('-c')) {
      console.log('Opening AvatarOS Configuration Editor...');
      const ConfigEditor = require('./ConfigEditor');
      new ConfigEditor();
      return;
    }

    console.log('═══════════════════════════════════════════');
    console.log('           🤖 AvatarOS v' + this.version + ' 🤖           ');
    console.log('   AI-Powered Minecraft Bot System');
    console.log('   with Memory & Dynamic Learning');
    console.log('═══════════════════════════════════════════\n');

    // Load configuration
    const config = this.loadConfig();
    
    console.log('✓ Configuration loaded successfully!');
    console.log('Server:', config.server + ':' + config.port);
    console.log('Minecraft Version:', config.version);
    console.log('AI Players:', config.aiPlayers.length);
    console.log('Twitch Integration:', config.twitch.enabled ? '✓ Enabled' : '✗ Disabled');
    console.log('Voice System:', config.features.voiceEnabled ? '✓ Enabled' : '✗ Disabled');
    console.log('Plugins:', config.plugins?.enabled ? '✓ Enabled' : '✗ Disabled');
    console.log('Mods:', config.mods?.enabled ? '✓ Enabled' : '✗ Disabled');
    console.log('AI Memory:', '✓ Active');
    console.log('Dynamic Learning:', '✓ Active');
    console.log('\n💡 Tip: Run with --config or -c to open the configuration editor');
    console.log('\n===========================================\n');

    // Initialize systems
    console.log('[INIT] Initializing systems...');
    
    this.streamScheduler = new StreamScheduler(config);
    console.log('[INIT] Stream scheduler initialized');

    this.voiceSystem = new VoiceSystem(config);
    console.log('[INIT] Voice system initialized');
    console.log('[INIT] Available voices:', this.voiceSystem.getAvailableVoices());

    // Validate streaming schedules
    const conflicts = this.streamScheduler.validateSchedules(config.aiPlayers);
    if (conflicts.length > 0) {
      console.warn('[WARN] Schedule conflicts detected:');
      conflicts.forEach(c => console.warn(`  - ${c.message}`));
    } else {
      console.log('[INFO] No schedule conflicts found');
    }

    // Initialize Twitch chat
    if (config.twitch.enabled) {
      this.chatHandler = new TwitchChatHandler(config);
      await this.chatHandler.connect();
    }

    // Initialize bot manager
    this.botManager = new BotManager(
      config,
      this.streamScheduler,
      this.voiceSystem,
      this.chatHandler
    );
    console.log('[INIT] Bot manager initialized');

    console.log('\n[INFO] Starting AI players...\n');

    // Start all AI players
    await this.botManager.startAll();

    console.log('\n[INFO] All systems operational!');
    console.log('[INFO] Pipeline running...');
    console.log('[INFO] Press Ctrl+C to stop\n');

    // Monitor streaming schedules
    this.startScheduleMonitor(config);

    // Handle graceful shutdown
    this.setupShutdownHandlers();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(configData);
      } else {
        console.log('[WARN] Config file not found, using defaults');
        return this.getDefaultConfig();
      }
    } catch (error) {
      console.error('[ERROR] Failed to load config:', error.message);
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      server: 'localhost',
      port: 25565,
      version: '1.20.1',
      autoReconnect: true,
      reconnectDelay: 5000,
      twitch: {
        enabled: false,
        channelName: 'minecraft_ai_collab',
        oauth: 'oauth:your_token_here',
        clientId: 'your_client_id_here',
        streamingEnabled: false
      },
      aiPlayers: [],
      features: {
        autoMine: false,
        autoFarm: false,
        pathfinding: true,
        chatInteraction: true,
        gameCommentary: true,
        voiceEnabled: false
      }
    };
  }

  startScheduleMonitor(config) {
    // Configuration constants
    const CHECK_INTERVAL_MS = 60000; // Check every minute
    const STATUS_LOG_PROBABILITY = 0.2; // 20% chance to log status
    
    // Check streaming schedules every minute
    setInterval(() => {
      if (this.botManager) {
        this.botManager.updateStreamingStatus();
        
        // Log status every 5 minutes (approximately)
        if (Math.random() < STATUS_LOG_PROBABILITY) {
          const status = this.botManager.getStatus();
          console.log(`[STATUS] Active: ${status.activePlayers}/${status.totalPlayers} | Streaming: ${status.streamingPlayers}`);
        }
      }
    }, CHECK_INTERVAL_MS);
  }

  setupShutdownHandlers() {
    const shutdown = () => {
      console.log('\n\n[INFO] Shutting down bot pipeline...');
      
      if (this.botManager) {
        this.botManager.stopAll();
      }

      if (this.chatHandler) {
        this.chatHandler.disconnect();
      }

      console.log('[INFO] All systems stopped');
      console.log('[INFO] Goodbye!');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// Start the application
if (require.main === module) {
  const avatarOS = new AvatarOS();
  avatarOS.start().catch(error => {
    console.error('[ERROR] Fatal error:', error);
    process.exit(1);
  });
}

module.exports = AvatarOS;
