/**
 * AI Memory System - Stores and recalls experiences, learns from interactions
 */

const fs = require('fs');
const path = require('path');

class AIMemorySystem {
  constructor(playerConfig) {
    this.playerConfig = playerConfig;
    this.memoryPath = path.join(__dirname, '../memory', `${playerConfig.id}.json`);
    this.memory = this.loadMemory();
    
    // Memory categories
    this.shortTermMemory = []; // Recent events (last 100)
    this.longTermMemory = this.memory.longTerm || [];
    this.learnedBehaviors = this.memory.behaviors || {};
    this.pluginKnowledge = this.memory.plugins || {};
    this.modKnowledge = this.memory.mods || {};
    this.playerInteractions = this.memory.interactions || {};
  }

  loadMemory() {
    try {
      // Ensure memory directory exists
      const memoryDir = path.dirname(this.memoryPath);
      if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
      }

      if (fs.existsSync(this.memoryPath)) {
        const data = fs.readFileSync(this.memoryPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`[Memory] Error loading memory for ${this.playerConfig.username}:`, error.message);
    }

    return {
      longTerm: [],
      behaviors: {},
      plugins: {},
      mods: {},
      interactions: {},
      createdAt: new Date().toISOString()
    };
  }

  saveMemory() {
    try {
      const memoryData = {
        longTerm: this.longTermMemory,
        behaviors: this.learnedBehaviors,
        plugins: this.pluginKnowledge,
        mods: this.modKnowledge,
        interactions: this.playerInteractions,
        lastUpdated: new Date().toISOString()
      };

      fs.writeFileSync(this.memoryPath, JSON.stringify(memoryData, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`[Memory] Error saving memory for ${this.playerConfig.username}:`, error.message);
      return false;
    }
  }

  // Add event to short-term memory
  remember(event) {
    const memoryEntry = {
      timestamp: new Date().toISOString(),
      type: event.type,
      data: event.data,
      importance: event.importance || 1
    };

    this.shortTermMemory.push(memoryEntry);

    // Keep only last 100 entries in short-term memory
    if (this.shortTermMemory.length > 100) {
      this.shortTermMemory.shift();
    }

    // Important events go to long-term memory
    if (event.importance >= 5) {
      this.commitToLongTerm(memoryEntry);
    }

    return memoryEntry;
  }

  // Move important memories to long-term storage
  commitToLongTerm(entry) {
    this.longTermMemory.push(entry);

    // Keep only last 1000 long-term memories
    if (this.longTermMemory.length > 1000) {
      this.longTermMemory.shift();
    }

    this.saveMemory();
  }

  // Learn a new behavior
  learnBehavior(behaviorName, context) {
    if (!this.learnedBehaviors[behaviorName]) {
      this.learnedBehaviors[behaviorName] = {
        learned: new Date().toISOString(),
        uses: 0,
        successes: 0,
        failures: 0,
        contexts: []
      };
    }

    this.learnedBehaviors[behaviorName].uses++;
    this.learnedBehaviors[behaviorName].contexts.push({
      timestamp: new Date().toISOString(),
      ...context
    });

    // Keep only last 50 contexts
    if (this.learnedBehaviors[behaviorName].contexts.length > 50) {
      this.learnedBehaviors[behaviorName].contexts.shift();
    }

    this.saveMemory();
  }

  // Record behavior success/failure
  recordBehaviorOutcome(behaviorName, success) {
    if (this.learnedBehaviors[behaviorName]) {
      if (success) {
        this.learnedBehaviors[behaviorName].successes++;
      } else {
        this.learnedBehaviors[behaviorName].failures++;
      }
      this.saveMemory();
    }
  }

  // Learn about a plugin
  learnPlugin(pluginName, capabilities) {
    this.pluginKnowledge[pluginName] = {
      discovered: new Date().toISOString(),
      capabilities: capabilities,
      commands: capabilities.commands || [],
      features: capabilities.features || [],
      usageExamples: [],
      effectivenessRating: 5 // 1-10 scale
    };

    console.log(`[Memory] ${this.playerConfig.username} learned about plugin: ${pluginName}`);
    this.saveMemory();
  }

  // Learn about a mod
  learnMod(modName, capabilities) {
    this.modKnowledge[modName] = {
      discovered: new Date().toISOString(),
      capabilities: capabilities,
      commands: capabilities.commands || [],
      features: capabilities.features || [],
      usageExamples: [],
      effectivenessRating: 5 // 1-10 scale
    };

    console.log(`[Memory] ${this.playerConfig.username} learned about mod: ${modName}`);
    this.saveMemory();
  }

  // Record plugin/mod usage
  recordUsage(type, name, action, result) {
    const knowledge = type === 'plugin' ? this.pluginKnowledge : this.modKnowledge;
    
    if (knowledge[name]) {
      knowledge[name].usageExamples.push({
        timestamp: new Date().toISOString(),
        action: action,
        result: result,
        success: result.success || false
      });

      // Adjust effectiveness rating based on success
      if (result.success) {
        knowledge[name].effectivenessRating = Math.min(10, knowledge[name].effectivenessRating + 0.1);
      } else {
        knowledge[name].effectivenessRating = Math.max(1, knowledge[name].effectivenessRating - 0.1);
      }

      // Keep only last 100 usage examples
      if (knowledge[name].usageExamples.length > 100) {
        knowledge[name].usageExamples.shift();
      }

      this.saveMemory();
    }
  }

  // Remember interaction with a player
  recordPlayerInteraction(playerName, interaction) {
    if (!this.playerInteractions[playerName]) {
      this.playerInteractions[playerName] = {
        firstMet: new Date().toISOString(),
        interactions: [],
        relationship: 'neutral' // friendly, neutral, hostile
      };
    }

    this.playerInteractions[playerName].interactions.push({
      timestamp: new Date().toISOString(),
      type: interaction.type,
      context: interaction.context
    });

    // Keep only last 50 interactions per player
    if (this.playerInteractions[playerName].interactions.length > 50) {
      this.playerInteractions[playerName].interactions.shift();
    }

    this.saveMemory();
  }

  // Recall information
  recall(query) {
    const results = {
      shortTerm: [],
      longTerm: [],
      behaviors: [],
      plugins: [],
      mods: []
    };

    const queryLower = query.toLowerCase();

    // Search short-term memory
    results.shortTerm = this.shortTermMemory.filter(entry => 
      JSON.stringify(entry).toLowerCase().includes(queryLower)
    );

    // Search long-term memory
    results.longTerm = this.longTermMemory.filter(entry =>
      JSON.stringify(entry).toLowerCase().includes(queryLower)
    );

    // Search learned behaviors
    results.behaviors = Object.keys(this.learnedBehaviors).filter(behavior =>
      behavior.toLowerCase().includes(queryLower)
    ).map(behavior => ({
      name: behavior,
      ...this.learnedBehaviors[behavior]
    }));

    // Search plugin knowledge
    results.plugins = Object.keys(this.pluginKnowledge).filter(plugin =>
      plugin.toLowerCase().includes(queryLower)
    ).map(plugin => ({
      name: plugin,
      ...this.pluginKnowledge[plugin]
    }));

    // Search mod knowledge
    results.mods = Object.keys(this.modKnowledge).filter(mod =>
      mod.toLowerCase().includes(queryLower)
    ).map(mod => ({
      name: mod,
      ...this.modKnowledge[mod]
    }));

    return results;
  }

  // Get all known plugins
  getKnownPlugins() {
    return Object.keys(this.pluginKnowledge);
  }

  // Get all known mods
  getKnownMods() {
    return Object.keys(this.modKnowledge);
  }

  // Get relationship with player
  getRelationship(playerName) {
    return this.playerInteractions[playerName]?.relationship || 'neutral';
  }

  // Think about what to do (AI decision making)
  think(context) {
    // Analyze context and memory to make decisions
    const relevantMemories = this.recall(context.situation || '');
    
    // Suggest actions based on past experiences
    const suggestions = [];

    // Check if we've been in similar situations
    relevantMemories.behaviors.forEach(behavior => {
      const totalAttempts = (behavior.successes || 0) + (behavior.failures || 0);
      const successRate = totalAttempts > 0 ? (behavior.successes || 0) / totalAttempts : 0;
      
      if (successRate > 0.6) {
        suggestions.push({
          action: behavior.name,
          confidence: successRate,
          reason: `Past success rate: ${(successRate * 100).toFixed(1)}%`
        });
      }
    });

    // Consider available plugins/mods
    if (context.needsPlugin) {
      relevantMemories.plugins.forEach(plugin => {
        if (plugin.effectivenessRating > 6) {
          suggestions.push({
            action: `use_plugin_${plugin.name}`,
            confidence: plugin.effectivenessRating / 10,
            reason: `Plugin effectiveness: ${plugin.effectivenessRating}/10`
          });
        }
      });
    }

    // Sort by confidence
    suggestions.sort((a, b) => b.confidence - a.confidence);

    return {
      suggestions: suggestions.slice(0, 5),
      memoryRelevance: relevantMemories
    };
  }

  // Clear all memory (reset)
  clearMemory() {
    this.shortTermMemory = [];
    this.longTermMemory = [];
    this.learnedBehaviors = {};
    this.pluginKnowledge = {};
    this.modKnowledge = {};
    this.playerInteractions = {};
    this.saveMemory();
    console.log(`[Memory] ${this.playerConfig.username} memory cleared`);
  }

  // Get memory stats
  getStats() {
    return {
      shortTermEntries: this.shortTermMemory.length,
      longTermEntries: this.longTermMemory.length,
      learnedBehaviors: Object.keys(this.learnedBehaviors).length,
      knownPlugins: Object.keys(this.pluginKnowledge).length,
      knownMods: Object.keys(this.modKnowledge).length,
      knownPlayers: Object.keys(this.playerInteractions).length
    };
  }
}

module.exports = AIMemorySystem;
