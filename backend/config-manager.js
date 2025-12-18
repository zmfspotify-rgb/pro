const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '../config/config.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    // Return default config
    return {
      bots: [],
      minecraft: {
        host: 'localhost',
        port: 25565,
        version: '1.19',
        auth: 'offline'
      },
      twitch: {
        channel: '',
        streamKey: '',
        oauth: ''
      },
      voice: {
        enabled: true,
        model: 'default'
      }
    };
  }

  saveConfig() {
    try {
      const dir = path.dirname(this.configPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('Configuration saved');
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(updates) {
    this.config = {
      ...this.config,
      ...updates
    };
    this.saveConfig();
  }

  getBotConfig(botId) {
    // Return bot-specific config merged with global config
    const botConfig = this.config.botConfigs?.[botId] || {};
    
    return {
      minecraft: {
        ...this.config.minecraft,
        ...botConfig.minecraft,
        username: botId
      },
      twitch: {
        ...this.config.twitch,
        ...botConfig.twitch
      },
      voice: {
        ...this.config.voice,
        ...botConfig.voice
      }
    };
  }

  updateBotConfig(botId, config) {
    if (!this.config.botConfigs) {
      this.config.botConfigs = {};
    }
    
    this.config.botConfigs[botId] = {
      ...this.config.botConfigs[botId],
      ...config
    };
    
    this.saveConfig();
  }

  addBot(botId) {
    if (!this.config.bots.includes(botId)) {
      this.config.bots.push(botId);
      this.saveConfig();
    }
  }

  removeBot(botId) {
    this.config.bots = this.config.bots.filter(id => id !== botId);
    if (this.config.botConfigs) {
      delete this.config.botConfigs[botId];
    }
    this.saveConfig();
  }
}

module.exports = ConfigManager;
