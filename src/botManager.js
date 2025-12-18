const EventEmitter = require('events');
const mineflayer = require('mineflayer');
const fs = require('fs').promises;
const path = require('path');

class BotManager extends EventEmitter {
  constructor() {
    super();
    this.bots = new Map();
    this.schedule = [];
    this.dataPath = path.join(__dirname, '..', 'data');
    this.botsFile = path.join(this.dataPath, 'bots.json');
    this.scheduleFile = path.join(this.dataPath, 'schedule.json');
    this.logsMap = new Map();
    
    this.init();
    this.startScheduleChecker();
  }

  async init() {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await this.loadBots();
      await this.loadSchedule();
    } catch (error) {
      console.error('Failed to initialize BotManager:', error);
    }
  }

  async loadBots() {
    try {
      const data = await fs.readFile(this.botsFile, 'utf8');
      const botsData = JSON.parse(data);
      botsData.forEach(bot => {
        this.bots.set(bot.id, {
          ...bot,
          status: 'offline',
          instance: null
        });
        this.logsMap.set(bot.id, []);
      });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Failed to load bots:', error);
      }
    }
  }

  async loadSchedule() {
    try {
      const data = await fs.readFile(this.scheduleFile, 'utf8');
      this.schedule = JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Failed to load schedule:', error);
      }
    }
  }

  async saveBots() {
    const botsData = Array.from(this.bots.values()).map(bot => ({
      id: bot.id,
      name: bot.name,
      username: bot.username,
      password: bot.password,
      server: bot.server,
      port: bot.port,
      alwaysOn: bot.alwaysOn || false,
      autoReconnect: bot.autoReconnect !== false
    }));
    await fs.writeFile(this.botsFile, JSON.stringify(botsData, null, 2));
  }

  async saveSchedule() {
    await fs.writeFile(this.scheduleFile, JSON.stringify(this.schedule, null, 2));
  }

  getBots() {
    return Array.from(this.bots.values()).map(bot => ({
      id: bot.id,
      name: bot.name,
      username: bot.username,
      server: bot.server,
      port: bot.port,
      status: bot.status,
      alwaysOn: bot.alwaysOn || false,
      autoReconnect: bot.autoReconnect !== false
    }));
  }

  async addBot(config) {
    const id = Date.now().toString();
    const bot = {
      id,
      name: config.name,
      username: config.username,
      password: config.password || '',
      server: config.server,
      port: config.port || 25565,
      status: 'offline',
      instance: null,
      alwaysOn: config.alwaysOn || false,
      autoReconnect: config.autoReconnect !== false
    };
    
    this.bots.set(id, bot);
    this.logsMap.set(id, []);
    await this.saveBots();
    
    return { success: true, botId: id };
  }

  async removeBot(botId) {
    const bot = this.bots.get(botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }
    
    if (bot.instance) {
      bot.instance.quit();
    }
    
    this.bots.delete(botId);
    this.logsMap.delete(botId);
    await this.saveBots();
    
    return { success: true };
  }

  async updateBot(botId, updates) {
    const bot = this.bots.get(botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }
    
    Object.assign(bot, updates);
    await this.saveBots();
    
    return { success: true };
  }

  async startBot(botId) {
    const bot = this.bots.get(botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }
    
    if (bot.instance) {
      return { success: false, error: 'Bot already running' };
    }
    
    try {
      const botConfig = {
        host: bot.server,
        port: bot.port,
        username: bot.username,
        version: false, // Auto-detect
        auth: bot.password ? 'microsoft' : 'offline'
      };

      if (bot.password) {
        botConfig.password = bot.password;
      }

      bot.instance = mineflayer.createBot(botConfig);
      
      bot.instance.on('login', () => {
        this.updateBotStatus(botId, 'online');
        this.addLog(botId, 'info', `${bot.name} logged in successfully`);
      });
      
      bot.instance.on('spawn', () => {
        this.addLog(botId, 'info', `${bot.name} spawned in world`);
      });
      
      bot.instance.on('error', (err) => {
        this.addLog(botId, 'error', `Error: ${err.message}`);
      });
      
      bot.instance.on('end', (reason) => {
        this.addLog(botId, 'warn', `Disconnected: ${reason || 'Unknown reason'}`);
        this.updateBotStatus(botId, 'offline');
        bot.instance = null;
        
        // Auto-reconnect if enabled
        if (bot.autoReconnect && (bot.alwaysOn || this.shouldBotBeOnline(botId))) {
          setTimeout(() => {
            this.startBot(botId);
          }, 5000);
        }
      });
      
      bot.instance.on('kicked', (reason) => {
        this.addLog(botId, 'error', `Kicked: ${reason}`);
      });
      
      // Simple anti-AFK behavior
      setInterval(() => {
        if (bot.instance && bot.instance.entity) {
          // Look around randomly
          bot.instance.look(Math.random() * Math.PI * 2, Math.random() * Math.PI - Math.PI / 2);
        }
      }, 30000);
      
      this.updateBotStatus(botId, 'connecting');
      return { success: true };
    } catch (error) {
      this.addLog(botId, 'error', `Failed to start: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async stopBot(botId) {
    const bot = this.bots.get(botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }
    
    if (!bot.instance) {
      return { success: false, error: 'Bot not running' };
    }
    
    bot.instance.quit();
    bot.instance = null;
    this.updateBotStatus(botId, 'offline');
    this.addLog(botId, 'info', `${bot.name} stopped`);
    
    return { success: true };
  }

  updateBotStatus(botId, status) {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.status = status;
      this.emit('bot-status-changed', { botId, status });
    }
  }

  addLog(botId, level, message) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    
    const logs = this.logsMap.get(botId) || [];
    logs.push(log);
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.shift();
    }
    
    this.logsMap.set(botId, logs);
    this.emit('bot-log', { botId, log });
  }

  getLogs(botId) {
    return this.logsMap.get(botId) || [];
  }

  getSchedule() {
    return this.schedule;
  }

  async updateSchedule(schedule) {
    this.schedule = schedule;
    await this.saveSchedule();
    return { success: true };
  }

  shouldBotBeOnline(botId) {
    const bot = this.bots.get(botId);
    if (!bot) return false;
    
    // If alwaysOn is enabled, bot should always be online
    if (bot.alwaysOn) return true;
    
    // Check schedule
    const now = new Date();
    const currentDay = now.getDay(); // 0-6
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const slot of this.schedule) {
      if (slot.botId === botId && slot.enabled !== false) {
        for (const day of slot.days || []) {
          if (day === currentDay) {
            const startTime = this.parseTime(slot.startTime);
            const endTime = this.parseTime(slot.endTime);
            
            if (currentTime >= startTime && currentTime < endTime) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  startScheduleChecker() {
    // Check every minute
    setInterval(() => {
      this.bots.forEach((bot, botId) => {
        const shouldBeOnline = this.shouldBotBeOnline(botId);
        const isOnline = bot.status === 'online' || bot.status === 'connecting';
        
        if (shouldBeOnline && !isOnline) {
          this.addLog(botId, 'info', 'Starting bot based on schedule');
          this.startBot(botId);
        } else if (!shouldBeOnline && isOnline && !bot.alwaysOn) {
          this.addLog(botId, 'info', 'Stopping bot based on schedule');
          this.stopBot(botId);
        }
      });
    }, 60000);
  }
}

module.exports = BotManager;
