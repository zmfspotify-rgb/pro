/**
 * AI Player Manager - Handles multiple Mineflayer bots
 */

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const PluginManager = require('./PluginManager');
const ModManager = require('./ModManager');

class AIPlayer {
  constructor(config, playerConfig, streamScheduler, voiceSystem, chatHandler) {
    this.config = config;
    this.playerConfig = playerConfig;
    this.streamScheduler = streamScheduler;
    this.voiceSystem = voiceSystem;
    this.chatHandler = chatHandler;
    this.bot = null;
    this.isActive = false;
    this.isStreaming = false;
    this.pluginManager = null;
    this.modManager = null;
  }

  async connect() {
    console.log(`[${this.playerConfig.username}] Connecting to ${this.config.server}:${this.config.port}...`);
    
    try {
      this.bot = mineflayer.createBot({
        host: this.config.server,
        port: this.config.port,
        username: this.playerConfig.username,
        version: this.config.version,
        auth: 'offline'
      });

      // Load pathfinder
      this.bot.loadPlugin(pathfinder);

      // Initialize plugin and mod managers
      this.pluginManager = new PluginManager(this.config);
      this.modManager = new ModManager(this.config, this.voiceSystem);

      this.setupEventHandlers();
      this.isActive = true;
      
      return true;
    } catch (error) {
      console.error(`[${this.playerConfig.username}] Connection failed:`, error.message);
      return false;
    }
  }

  setupEventHandlers() {
    this.bot.on('spawn', () => {
      console.log(`[${this.playerConfig.username}] Spawned in game!`);
      
      // Load plugins and mods after spawn
      if (this.pluginManager) {
        this.pluginManager.loadPlugins(this.bot, this.playerConfig);
      }
      
      if (this.modManager) {
        this.modManager.loadMods(this.bot, this.playerConfig);
      }
      
      // Check if should start streaming
      if (this.streamScheduler.shouldStream(this.playerConfig)) {
        this.startStreaming();
      }

      // Initialize pathfinder movements
      const mcData = require('minecraft-data')(this.bot.version);
      const defaultMove = new Movements(this.bot, mcData);
      this.bot.pathfinder.setMovements(defaultMove);
    });

    this.bot.on('chat', (username, message) => {
      if (username === this.bot.username) return;
      
      console.log(`[${this.playerConfig.username}] Chat: <${username}> ${message}`);
      
      // AI commentary on chat
      if (this.config.features.gameCommentary) {
        this.commentOnEvent('chat', { username, message });
      }
    });

    this.bot.on('playerJoined', (player) => {
      console.log(`[${this.playerConfig.username}] Player joined: ${player.username}`);
      
      if (this.config.features.gameCommentary) {
        this.commentOnEvent('playerJoin', { player: player.username });
      }
    });

    this.bot.on('playerLeft', (player) => {
      console.log(`[${this.playerConfig.username}] Player left: ${player.username}`);
    });

    this.bot.on('death', () => {
      console.log(`[${this.playerConfig.username}] Died! Respawning...`);
      
      if (this.config.features.gameCommentary) {
        this.commentOnEvent('death', {});
      }
    });

    this.bot.on('error', (err) => {
      console.error(`[${this.playerConfig.username}] Error:`, err.message);
    });

    this.bot.on('kicked', (reason) => {
      console.log(`[${this.playerConfig.username}] Kicked:`, reason);
      this.handleReconnect();
    });

    this.bot.on('end', () => {
      console.log(`[${this.playerConfig.username}] Disconnected`);
      this.handleReconnect();
    });
  }

  handleReconnect() {
    this.isActive = false;
    
    if (this.config.autoReconnect) {
      console.log(`[${this.playerConfig.username}] Reconnecting in ${this.config.reconnectDelay}ms...`);
      setTimeout(() => {
        this.connect();
      }, this.config.reconnectDelay);
    }
  }

  startStreaming() {
    if (this.isStreaming) return;
    
    console.log(`[${this.playerConfig.username}] Starting Twitch stream...`);
    this.isStreaming = true;
    
    // In a real implementation, this would:
    // 1. Initialize prismarine-viewer for bot POV
    // 2. Capture the view and stream to Twitch via RTMP
    // 3. Connect to Twitch chat via tmi.js
    
    if (this.chatHandler) {
      this.chatHandler.connectBot(this.playerConfig);
    }
  }

  stopStreaming() {
    if (!this.isStreaming) return;
    
    console.log(`[${this.playerConfig.username}] Stopping Twitch stream...`);
    this.isStreaming = false;
    
    if (this.chatHandler) {
      this.chatHandler.disconnectBot(this.playerConfig);
    }
  }

  commentOnEvent(eventType, data) {
    const comments = {
      chat: [
        `Interesting point, ${data.username}!`,
        `I see what you mean, ${data.username}.`,
        `That's a good question!`
      ],
      playerJoin: [
        `Welcome to the server, ${data.player}!`,
        `Hey ${data.player}, glad you could join us!`,
        `Nice to see you, ${data.player}!`
      ],
      death: [
        `Oops, that didn't go as planned!`,
        `Well, that was unexpected...`,
        `I'll be more careful next time!`
      ],
      mining: [
        `Found some valuable resources!`,
        `This mining spot looks promising.`,
        `Let's see what we can find here.`
      ],
      building: [
        `This is coming along nicely!`,
        `I love how this is turning out.`,
        `Great spot for building!`
      ]
    };

    const eventComments = comments[eventType] || [];
    if (eventComments.length > 0) {
      const comment = eventComments[Math.floor(Math.random() * eventComments.length)];
      
      // Send to chat
      if (this.bot && this.bot.chat) {
        this.bot.chat(comment);
      }

      // Use voice if enabled
      if (this.config.features.voiceEnabled && this.voiceSystem) {
        this.voiceSystem.speak(comment, this.playerConfig.voiceModel);
      }

      // Send to Twitch chat if streaming
      if (this.isStreaming && this.chatHandler) {
        this.chatHandler.sendMessage(comment, this.playerConfig);
      }
    }
  }

  performAction(action, params) {
    if (!this.bot) return;

    switch (action) {
      case 'goto':
        if (params.x !== undefined && params.y !== undefined && params.z !== undefined) {
          const goal = new goals.GoalBlock(params.x, params.y, params.z);
          this.bot.pathfinder.setGoal(goal);
        }
        break;
      
      case 'mine':
        // Mining logic would go here
        this.commentOnEvent('mining', {});
        break;
      
      case 'build':
        // Building logic would go here
        this.commentOnEvent('building', {});
        break;
      
      case 'chat':
        if (params.message) {
          this.bot.chat(params.message);
        }
        break;
    }
  }

  disconnect() {
    if (this.bot) {
      this.stopStreaming();
      this.bot.quit();
      this.bot = null;
    }
    this.isActive = false;
  }
}

module.exports = AIPlayer;
