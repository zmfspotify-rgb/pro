/**
 * Twitch Chat Handler - Manages Twitch chat interaction
 */

const tmi = require('tmi.js');

class TwitchChatHandler {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.activeBots = new Map();
    this.chatCommands = new Map();
    this.setupCommands();
  }

  async connect() {
    if (!this.config.twitch.enabled) {
      console.log('[TwitchChat] Twitch integration is disabled');
      return false;
    }

    const opts = {
      identity: {
        username: this.config.twitch.channelName,
        password: this.config.twitch.oauth
      },
      channels: [this.config.twitch.channelName]
    };

    try {
      this.client = new tmi.Client(opts);
      await this.client.connect();
      
      console.log(`[TwitchChat] Connected to channel: ${this.config.twitch.channelName}`);
      
      this.setupEventHandlers();
      return true;
    } catch (error) {
      console.error('[TwitchChat] Connection failed:', error.message);
      return false;
    }
  }

  setupEventHandlers() {
    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;

      console.log(`[TwitchChat] ${tags.username}: ${message}`);

      // Check for commands
      if (message.startsWith('!')) {
        this.handleCommand(tags.username, message);
      } else {
        // AI bots can respond to general chat
        this.handleChatInteraction(tags.username, message);
      }
    });

    this.client.on('connected', (address, port) => {
      console.log(`[TwitchChat] Connected to ${address}:${port}`);
    });
  }

  setupCommands() {
    this.chatCommands.set('!bots', () => {
      const botList = Array.from(this.activeBots.keys()).join(', ');
      return `Active AI players: ${botList || 'None'}`;
    });

    this.chatCommands.set('!help', () => {
      return 'Available commands: !bots, !help, !schedule, !voice';
    });

    this.chatCommands.set('!schedule', () => {
      return 'Check the schedule to see when each AI player streams!';
    });

    this.chatCommands.set('!voice', () => {
      return 'Our AI players use realistic voice models to interact!';
    });
  }

  handleCommand(username, message) {
    const command = message.split(' ')[0].toLowerCase();
    const handler = this.chatCommands.get(command);

    if (handler) {
      const response = handler();
      this.sendMessage(response);
    }
  }

  handleChatInteraction(username, message) {
    // AI bots can randomly respond to chat messages
    if (Math.random() < 0.2) { // 20% chance to respond
      const responses = [
        `Great point, ${username}!`,
        `I agree with ${username}!`,
        `Interesting thought, ${username}.`,
        `${username}, that's a good idea!`,
        `Thanks for sharing, ${username}!`
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      
      // Delay to make it feel more natural
      setTimeout(() => {
        this.sendMessage(response);
      }, 1000 + Math.random() * 2000);
    }
  }

  connectBot(playerConfig) {
    this.activeBots.set(playerConfig.username, playerConfig);
    console.log(`[TwitchChat] Bot ${playerConfig.username} connected to chat`);
  }

  disconnectBot(playerConfig) {
    this.activeBots.delete(playerConfig.username);
    console.log(`[TwitchChat] Bot ${playerConfig.username} disconnected from chat`);
  }

  sendMessage(message, playerConfig = null) {
    if (!this.client) return;

    const prefix = playerConfig ? `[${playerConfig.username}] ` : '';
    
    this.client.say(this.config.twitch.channelName, prefix + message)
      .catch(err => console.error('[TwitchChat] Failed to send message:', err));
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      console.log('[TwitchChat] Disconnected');
    }
  }
}

module.exports = TwitchChatHandler;
