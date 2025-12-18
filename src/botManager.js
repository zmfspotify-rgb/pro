/**
 * Bot Manager
 * Handles creation and management of Minecraft bots
 */

import mineflayer from 'mineflayer';
import pathfinderPlugin from 'mineflayer-pathfinder';
import mcData from 'minecraft-data';
import { BotMemory, BotPersonality, personalityTraits } from './aiPersonality.js';
import { getVoicePreset, getRandomVoicePreset } from './voicePresets.js';
import { StreamingSchedule } from './streamingSchedule.js';

const { pathfinder, Movements, goals } = pathfinderPlugin;

export class BotManager {
  constructor() {
    this.bots = new Map();
    this.schedule = new StreamingSchedule();
    this.is24x7Active = false;
    this.serverConfig = {
      host: 'localhost',
      port: 25565,
      version: '1.20.1'
    };
  }

  /**
   * Create a new bot
   * @param {object} config - Bot configuration
   * @returns {object} Bot instance
   */
  createBot(config) {
    const {
      username,
      personalityType = 'explorer',
      voicePresetId = null,
      schedule = null,
      is24x7 = false
    } = config;

    // Get or assign voice preset
    const voicePreset = voicePresetId 
      ? getVoicePreset(voicePresetId) 
      : getRandomVoicePreset();

    // Create bot personality and memory
    const personality = new BotPersonality(personalityType, voicePreset);
    const memory = new BotMemory(username);

    // Create mineflayer bot
    const bot = mineflayer.createBot({
      host: this.serverConfig.host,
      port: this.serverConfig.port,
      username: username,
      version: this.serverConfig.version,
      auth: 'offline'
    });

    // Load pathfinder plugin
    bot.loadPlugin(pathfinder);

    // Add custom properties
    bot.personality = personality;
    bot.memory = memory;
    bot.voicePreset = voicePreset;
    bot.is24x7 = is24x7;

    // Set up event handlers
    this.setupBotEvents(bot, username);

    // Add to schedule if provided
    if (schedule) {
      this.schedule.addSchedule(username, schedule);
    } else if (is24x7) {
      this.schedule.addSchedule(username, {
        enabled: true,
        mode: "always"
      });
    }

    // Store bot
    this.bots.set(username, bot);

    console.log(`✓ Created bot: ${username} (${personality.traits.name}) with voice: ${voicePreset.name}`);

    return bot;
  }

  /**
   * Set up event handlers for a bot
   */
  setupBotEvents(bot, username) {
    bot.on('spawn', () => {
      console.log(`[${username}] Spawned in the world`);
      bot.memory.remember({ type: 'spawn', description: 'Spawned in world' });
      
      // Set up pathfinder movements
      const mcDataInstance = mcData(bot.version);
      const defaultMove = new Movements(bot, mcDataInstance);
      bot.pathfinder.setMovements(defaultMove);
    });

    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      
      console.log(`[${bot.username}] Heard ${username}: ${message}`);
      
      // Remember the interaction
      bot.memory.rememberPlayer(username, {
        type: 'chat',
        description: message,
        positive: message.toLowerCase().includes('hello') || message.toLowerCase().includes('thanks')
      });

      // Decide if bot should respond based on personality
      if (bot.personality.shouldRespond(message)) {
        let response;
        
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
          response = bot.personality.generateResponse({ type: 'greeting' });
        } else if (message.toLowerCase().includes('bye')) {
          response = bot.personality.generateResponse({ type: 'farewell' });
        } else if (message.toLowerCase().includes('thank')) {
          response = bot.personality.generateResponse({ type: 'thanks' });
        } else {
          // Default behavior based on personality
          const behavior = bot.personality.getCurrentBehavior();
          response = `I'm busy ${behavior} right now!`;
        }

        setTimeout(() => {
          bot.chat(response);
        }, 1000 + Math.random() * 2000); // Random delay to seem more human
      }
    });

    bot.on('playerJoined', (player) => {
      console.log(`[${bot.username}] ${player.username} joined the game`);
      bot.memory.remember({ type: 'player_join', player: player.username });
      
      // Greet based on relationship and personality
      const relationship = bot.memory.getRelationship(player.username);
      if (relationship > 0.6 && bot.personality.traits.friendliness > 0.5) {
        setTimeout(() => {
          bot.chat(`Welcome back, ${player.username}!`);
        }, 2000);
      }
    });

    bot.on('playerLeft', (player) => {
      console.log(`[${bot.username}] ${player.username} left the game`);
      bot.memory.remember({ type: 'player_leave', player: player.username });
    });

    bot.on('health', () => {
      if (bot.health < 10) {
        bot.personality.updateMood(-0.1);
        bot.memory.remember({ type: 'low_health', health: bot.health });
      }
    });

    bot.on('death', () => {
      console.log(`[${bot.username}] Died`);
      bot.personality.updateMood(-0.3);
      bot.memory.remember({ type: 'death', description: 'Bot died' });
      bot.memory.addAchievement('Died (respawning soon)');
    });

    bot.on('kicked', (reason) => {
      console.log(`[${bot.username}] Kicked: ${reason}`);
      bot.memory.remember({ type: 'kicked', reason });
    });

    bot.on('error', (err) => {
      console.error(`[${bot.username}] Error:`, err.message);
    });

    bot.on('end', () => {
      console.log(`[${bot.username}] Disconnected`);
    });
  }

  /**
   * Create a 24/7 AI player to keep server alive
   */
  create24x7Player(username = 'AI_Keeper') {
    console.log('Creating 24/7 AI player to keep Aternos server alive...');
    
    const bot = this.createBot({
      username,
      personalityType: 'guardian',
      is24x7: true
    });

    this.is24x7Active = true;

    // Add periodic activity to prevent AFK kick
    bot.activityInterval = setInterval(() => {
      if (bot.entity) {
        // Perform small movements or look around
        const yaw = Math.random() * Math.PI * 2;
        bot.look(yaw, 0, true);
        
        bot.memory.remember({ type: 'activity', description: 'Periodic activity check' });
      }
    }, 30000); // Every 30 seconds

    return bot;
  }

  /**
   * Stop a bot
   */
  stopBot(username) {
    const bot = this.bots.get(username);
    if (bot) {
      if (bot.activityInterval) {
        clearInterval(bot.activityInterval);
      }
      bot.quit();
      this.bots.delete(username);
      console.log(`✓ Stopped bot: ${username}`);
      return true;
    }
    return false;
  }

  /**
   * Stop all bots
   */
  stopAllBots() {
    for (const [username, bot] of this.bots.entries()) {
      if (bot.activityInterval) {
        clearInterval(bot.activityInterval);
      }
      bot.quit();
    }
    this.bots.clear();
    this.is24x7Active = false;
    console.log('✓ Stopped all bots');
  }

  /**
   * Check schedules and manage bot connections
   */
  checkSchedules() {
    const shouldBeOnline = this.schedule.getOnlineBots();
    
    // Start bots that should be online but aren't
    for (const botName of shouldBeOnline) {
      if (!this.bots.has(botName)) {
        console.log(`Starting ${botName} based on schedule`);
        // Would need bot configs stored to recreate
      }
    }

    // Stop bots that shouldn't be online
    for (const [botName, bot] of this.bots.entries()) {
      if (!bot.is24x7 && !shouldBeOnline.includes(botName)) {
        console.log(`Stopping ${botName} based on schedule`);
        this.stopBot(botName);
      }
    }
  }

  /**
   * Configure server connection
   */
  setServerConfig(config) {
    this.serverConfig = { ...this.serverConfig, ...config };
    console.log('✓ Server config updated:', this.serverConfig);
  }

  /**
   * Get bot status
   */
  getStatus() {
    const status = {
      totalBots: this.bots.size,
      is24x7Active: this.is24x7Active,
      bots: []
    };

    for (const [username, bot] of this.bots.entries()) {
      status.bots.push({
        username,
        personality: bot.personality.traits.name,
        voice: bot.voicePreset.name,
        is24x7: bot.is24x7 || false,
        health: bot.health,
        food: bot.food,
        position: bot.entity?.position
      });
    }

    return status;
  }
}
