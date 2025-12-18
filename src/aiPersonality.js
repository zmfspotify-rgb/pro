/**
 * AI Player Personalities and Memory System
 * Manages bot personalities, memories, and behaviors
 */

export const personalityTraits = {
  explorer: {
    name: "Explorer",
    behaviors: ["mining", "exploring", "collecting"],
    chattiness: 0.6,
    friendliness: 0.8,
    aggression: 0.2,
    description: "Loves to explore and discover new places"
  },
  builder: {
    name: "Builder",
    behaviors: ["building", "crafting", "organizing"],
    chattiness: 0.4,
    friendliness: 0.7,
    aggression: 0.1,
    description: "Focused on construction and creating structures"
  },
  warrior: {
    name: "Warrior",
    behaviors: ["fighting", "hunting", "protecting"],
    chattiness: 0.3,
    friendliness: 0.5,
    aggression: 0.8,
    description: "Combat-oriented, protects the group"
  },
  farmer: {
    name: "Farmer",
    behaviors: ["farming", "breeding", "gardening"],
    chattiness: 0.5,
    friendliness: 0.9,
    aggression: 0.1,
    description: "Peaceful farmer who tends to crops and animals"
  },
  trader: {
    name: "Trader",
    behaviors: ["trading", "collecting", "bartering"],
    chattiness: 0.9,
    friendliness: 0.8,
    aggression: 0.2,
    description: "Social trader who loves to interact and exchange"
  },
  redstoner: {
    name: "Redstoner",
    behaviors: ["redstone", "engineering", "automation"],
    chattiness: 0.4,
    friendliness: 0.6,
    aggression: 0.1,
    description: "Technical expert in redstone and automation"
  },
  adventurer: {
    name: "Adventurer",
    behaviors: ["questing", "exploring", "looting"],
    chattiness: 0.7,
    friendliness: 0.7,
    aggression: 0.5,
    description: "Seeks adventure and treasure"
  },
  guardian: {
    name: "Guardian",
    behaviors: ["patrolling", "protecting", "watching"],
    chattiness: 0.3,
    friendliness: 0.6,
    aggression: 0.6,
    description: "Vigilant protector of the base"
  }
};

export class BotMemory {
  constructor(botName) {
    this.botName = botName;
    this.shortTermMemory = [];
    this.longTermMemory = {
      players: {},
      locations: {},
      events: [],
      achievements: []
    };
    this.maxShortTermMemory = 50;
  }

  /**
   * Add a short-term memory
   */
  remember(event) {
    this.shortTermMemory.push({
      timestamp: Date.now(),
      event: event
    });

    // Keep only recent memories
    if (this.shortTermMemory.length > this.maxShortTermMemory) {
      this.shortTermMemory.shift();
    }
  }

  /**
   * Store long-term memory about a player
   */
  rememberPlayer(playerName, interaction) {
    if (!this.longTermMemory.players[playerName]) {
      this.longTermMemory.players[playerName] = {
        firstMet: Date.now(),
        interactions: [],
        relationship: 0.5
      };
    }

    this.longTermMemory.players[playerName].interactions.push({
      timestamp: Date.now(),
      type: interaction.type,
      description: interaction.description
    });

    // Update relationship based on interaction
    if (interaction.positive) {
      this.longTermMemory.players[playerName].relationship = Math.min(1.0, 
        this.longTermMemory.players[playerName].relationship + 0.05);
    } else if (interaction.negative) {
      this.longTermMemory.players[playerName].relationship = Math.max(0.0,
        this.longTermMemory.players[playerName].relationship - 0.05);
    }
  }

  /**
   * Store a location memory
   */
  rememberLocation(name, coordinates, description) {
    this.longTermMemory.locations[name] = {
      coordinates,
      description,
      visitCount: (this.longTermMemory.locations[name]?.visitCount || 0) + 1,
      lastVisit: Date.now()
    };
  }

  /**
   * Add an achievement
   */
  addAchievement(achievement) {
    this.longTermMemory.achievements.push({
      timestamp: Date.now(),
      achievement
    });
  }

  /**
   * Get relationship with a player
   */
  getRelationship(playerName) {
    return this.longTermMemory.players[playerName]?.relationship || 0.5;
  }

  /**
   * Get recent memories
   */
  getRecentMemories(count = 10) {
    return this.shortTermMemory.slice(-count);
  }

  /**
   * Export memory for persistence
   */
  export() {
    return {
      botName: this.botName,
      shortTermMemory: this.shortTermMemory,
      longTermMemory: this.longTermMemory
    };
  }

  /**
   * Import memory from persistence
   */
  import(data) {
    this.botName = data.botName;
    this.shortTermMemory = data.shortTermMemory || [];
    this.longTermMemory = data.longTermMemory || {
      players: {},
      locations: {},
      events: [],
      achievements: []
    };
  }
}

export class BotPersonality {
  constructor(personalityType, voicePreset) {
    this.type = personalityType;
    this.traits = personalityTraits[personalityType] || personalityTraits.explorer;
    this.voicePreset = voicePreset;
    this.mood = 0.7; // 0.0 = very sad, 1.0 = very happy
  }

  /**
   * Update mood based on events
   */
  updateMood(change) {
    this.mood = Math.max(0.0, Math.min(1.0, this.mood + change));
  }

  /**
   * Should the bot respond to a chat message?
   */
  shouldRespond(message) {
    // More likely to respond if chatty and in good mood
    const baseChance = this.traits.chattiness * this.mood;
    return Math.random() < baseChance;
  }

  /**
   * Get current behavior preference
   */
  getCurrentBehavior() {
    const behaviors = this.traits.behaviors;
    return behaviors[Math.floor(Math.random() * behaviors.length)];
  }

  /**
   * Generate a response based on personality
   */
  generateResponse(context) {
    // This is a simple template system
    // In a real implementation, this could use AI/LLM
    const responses = {
      greeting: [
        "Hello there!",
        "Hey!",
        "Greetings!",
        "Hi friend!"
      ],
      farewell: [
        "Goodbye!",
        "See you later!",
        "Take care!",
        "Until next time!"
      ],
      thanks: [
        "Thank you!",
        "Thanks a lot!",
        "I appreciate it!",
        "Much appreciated!"
      ]
    };

    const responseType = context.type || 'greeting';
    const options = responses[responseType] || responses.greeting;
    return options[Math.floor(Math.random() * options.length)];
  }
}
