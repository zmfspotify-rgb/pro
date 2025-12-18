const mineflayer = require('mineflayer');
const AITaskExecutor = require('./ai-task-executor');
const TwitchChatResponder = require('./twitch-chat-responder');

class MinecraftBot {
  constructor(botId, config) {
    this.botId = botId;
    this.config = config;
    this.bot = null;
    this.taskExecutor = null;
    this.chatResponder = null;
    this.currentTask = null;
  }

  async connect() {
    const botConfig = {
      host: this.config.minecraft.host || 'localhost',
      port: this.config.minecraft.port || 25565,
      username: this.config.minecraft.username || this.botId,
      version: this.config.minecraft.version || '1.19',
      auth: this.config.minecraft.auth || 'offline'
    };

    this.bot = mineflayer.createBot(botConfig);

    return new Promise((resolve, reject) => {
      this.bot.once('spawn', () => {
        console.log(`Bot ${this.botId} connected to Minecraft server`);
        this.setupEventHandlers();
        this.taskExecutor = new AITaskExecutor(this.bot, this.config);
        this.chatResponder = new TwitchChatResponder(this.botId, this.config);
        resolve();
      });

      this.bot.once('error', (err) => {
        console.error(`Bot ${this.botId} error:`, err);
        reject(err);
      });

      this.bot.once('kicked', (reason) => {
        console.log(`Bot ${this.botId} kicked:`, reason);
        reject(new Error(reason));
      });
    });
  }

  setupEventHandlers() {
    this.bot.on('chat', (username, message) => {
      console.log(`[${this.botId}] ${username}: ${message}`);
      
      // Respond to basic commands
      if (message.startsWith('!')) {
        this.handleCommand(username, message);
      }
    });

    this.bot.on('health', () => {
      if (this.bot.health <= 5) {
        console.log(`Bot ${this.botId} health low: ${this.bot.health}`);
        this.taskExecutor.executeTask({ type: 'heal' });
      }
    });

    this.bot.on('death', () => {
      console.log(`Bot ${this.botId} died, respawning...`);
      this.currentTask = null;
    });
  }

  async handleCommand(username, message) {
    const command = message.slice(1).toLowerCase();
    
    if (command === 'help') {
      this.bot.chat(`Hi ${username}! I'm an AI bot. I can play Minecraft and interact with chat!`);
    } else if (command === 'status') {
      const taskInfo = this.currentTask ? this.currentTask.type : 'idle';
      this.bot.chat(`Currently ${taskInfo}`);
    }
  }

  async executeTask(task) {
    this.currentTask = task;
    await this.taskExecutor.executeTask(task);
  }

  async disconnect() {
    if (this.bot) {
      this.bot.quit();
      this.bot = null;
    }
  }

  isConnected() {
    return this.bot !== null && this.bot.entity !== null;
  }

  getCurrentTask() {
    return this.currentTask;
  }

  getBot() {
    return this.bot;
  }

  async respondToTwitchChat(username, message) {
    if (this.chatResponder) {
      const response = await this.chatResponder.generateResponse(username, message);
      if (response) {
        return response;
      }
    }
    return null;
  }
}

module.exports = MinecraftBot;
