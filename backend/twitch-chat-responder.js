const tmi = require('tmi.js');

class TwitchChatResponder {
  constructor(botId, config) {
    this.botId = botId;
    this.config = config;
    this.client = null;
    this.responsePatterns = this.loadResponsePatterns();
    this.conversationHistory = [];
  }

  loadResponsePatterns() {
    return {
      greetings: ['hi', 'hello', 'hey', 'howdy', 'sup'],
      questions: {
        'what are you doing': 'I\'m exploring the world and gathering resources!',
        'how are you': 'I\'m doing great, thanks for asking!',
        'can you help': 'Sure! What do you need help with?',
        'where are you': 'I\'m currently exploring the area!'
      },
      compliments: ['nice', 'cool', 'awesome', 'great', 'good job'],
      farewells: ['bye', 'goodbye', 'see you', 'later']
    };
  }

  async generateResponse(username, message) {
    const lowerMessage = message.toLowerCase();
    
    // Store in conversation history
    this.conversationHistory.push({
      username,
      message,
      timestamp: Date.now()
    });

    // Keep only last 50 messages
    if (this.conversationHistory.length > 50) {
      this.conversationHistory.shift();
    }

    // Check for greetings
    if (this.responsePatterns.greetings.some(greeting => lowerMessage.includes(greeting))) {
      return `Hey ${username}! Welcome to the stream!`;
    }

    // Check for questions
    for (const [question, answer] of Object.entries(this.responsePatterns.questions)) {
      if (lowerMessage.includes(question)) {
        return answer;
      }
    }

    // Check for compliments
    if (this.responsePatterns.compliments.some(word => lowerMessage.includes(word))) {
      return `Thanks ${username}! I appreciate it!`;
    }

    // Check for farewells
    if (this.responsePatterns.farewells.some(word => lowerMessage.includes(word))) {
      return `See you later ${username}! Thanks for watching!`;
    }

    // Check if message mentions the bot
    if (lowerMessage.includes(this.botId.toLowerCase()) || lowerMessage.includes('bot')) {
      return `Yes ${username}? How can I help you?`;
    }

    // Random engagement responses (20% chance)
    if (Math.random() < 0.2) {
      const engagementResponses = [
        `Interesting point, ${username}!`,
        `That's a good observation!`,
        `I see what you mean!`,
        `Thanks for chatting!`
      ];
      return engagementResponses[Math.floor(Math.random() * engagementResponses.length)];
    }

    return null; // No response needed
  }

  async connectToTwitch(channelName) {
    const twitchConfig = this.config.twitch || {};
    
    this.client = new tmi.Client({
      options: { debug: false },
      identity: {
        username: twitchConfig.username || this.botId,
        password: twitchConfig.oauth
      },
      channels: [channelName]
    });

    await this.client.connect();
    console.log(`Bot ${this.botId} connected to Twitch channel: ${channelName}`);
  }

  async sendMessage(message) {
    if (this.client && this.config.twitch.channel) {
      await this.client.say(this.config.twitch.channel, message);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}

module.exports = TwitchChatResponder;
