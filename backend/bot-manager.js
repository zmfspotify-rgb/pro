const MinecraftBot = require('./minecraft-bot');
const TwitchStreamer = require('./twitch-streamer');
const ConfigManager = require('./config-manager');

class BotManager {
  constructor() {
    this.bots = new Map();
    this.streamers = new Map();
    this.configManager = new ConfigManager();
  }

  async startBot(botId) {
    if (this.bots.has(botId)) {
      throw new Error(`Bot ${botId} is already running`);
    }

    const config = this.configManager.getBotConfig(botId);
    const bot = new MinecraftBot(botId, config);
    
    await bot.connect();
    this.bots.set(botId, bot);
    
    console.log(`Bot ${botId} started successfully`);
    return bot;
  }

  async stopBot(botId) {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} is not running`);
    }

    // Stop streaming if active
    if (this.streamers.has(botId)) {
      await this.stopStreaming(botId);
    }

    await bot.disconnect();
    this.bots.delete(botId);
    
    console.log(`Bot ${botId} stopped successfully`);
  }

  async startStreaming(botId) {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} is not running`);
    }

    if (this.streamers.has(botId)) {
      throw new Error(`Bot ${botId} is already streaming`);
    }

    const config = this.configManager.getBotConfig(botId);
    const streamer = new TwitchStreamer(botId, bot, config);
    
    await streamer.start();
    this.streamers.set(botId, streamer);
    
    console.log(`Streaming started for bot ${botId}`);
    return streamer;
  }

  async stopStreaming(botId) {
    const streamer = this.streamers.get(botId);
    if (!streamer) {
      throw new Error(`Bot ${botId} is not streaming`);
    }

    await streamer.stop();
    this.streamers.delete(botId);
    
    console.log(`Streaming stopped for bot ${botId}`);
  }

  getBotStatus(botId) {
    const isRunning = this.bots.has(botId);
    const isStreaming = this.streamers.has(botId);
    
    const bot = this.bots.get(botId);
    const status = {
      running: isRunning,
      streaming: isStreaming,
      connected: bot ? bot.isConnected() : false,
      currentTask: bot ? bot.getCurrentTask() : null
    };

    return status;
  }

  getAllBots() {
    const config = this.configManager.getConfig();
    const botList = [];

    for (const botId of config.bots || []) {
      const status = this.getBotStatus(botId);
      botList.push({
        id: botId,
        ...status,
        config: this.configManager.getBotConfig(botId)
      });
    }

    return botList;
  }

  getBot(botId) {
    return this.bots.get(botId);
  }

  isStreaming(botId) {
    return this.streamers.has(botId);
  }
}

module.exports = BotManager;
