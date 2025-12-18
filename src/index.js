#!/usr/bin/env node

/**
 * Minecraft Bot Pipeline - Main Entry Point
 * A multi-bot Minecraft content pipeline project
 */

const path = require('path');
const fs = require('fs');

class MinecraftBotPipeline {
  constructor() {
    this.configPath = path.join(__dirname, '../config/config.json');
    this.version = require('../package.json').version;
  }

  async start() {
    console.log('===========================================');
    console.log('  Minecraft Bot Pipeline Launcher v' + this.version);
    console.log('===========================================\n');

    // Load configuration
    const config = this.loadConfig();
    
    console.log('Configuration loaded successfully!');
    console.log('Bot Name:', config.botName || 'Default Bot');
    console.log('Server:', config.server || 'localhost');
    console.log('Port:', config.port || 25565);
    console.log('\nPipeline Status: Ready');
    console.log('\n[INFO] Bot pipeline is starting...');
    console.log('[INFO] Press Ctrl+C to stop\n');

    // Main loop
    this.run(config);
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
      botName: 'MinecraftBot',
      server: 'localhost',
      port: 25565,
      version: '1.20.1',
      autoReconnect: true,
      reconnectDelay: 5000
    };
  }

  run(config) {
    console.log('[INFO] Bot pipeline running...');
    console.log('[INFO] Monitoring server:', config.server + ':' + config.port);
    
    // Keep the process alive
    setInterval(() => {
      // Placeholder for bot logic
      // In a real implementation, this would handle bot operations
    }, 1000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n[INFO] Shutting down bot pipeline...');
      console.log('[INFO] Goodbye!');
      process.exit(0);
    });
  }
}

// Start the application
if (require.main === module) {
  const pipeline = new MinecraftBotPipeline();
  pipeline.start().catch(error => {
    console.error('[ERROR] Fatal error:', error);
    process.exit(1);
  });
}

module.exports = MinecraftBotPipeline;
