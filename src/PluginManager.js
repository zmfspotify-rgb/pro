/**
 * Plugin Manager - Handles server-side plugins for AI players
 */

class PluginManager {
  constructor(config) {
    this.config = config;
    this.plugins = new Map();
    this.enabled = config.plugins?.enabled || false;
  }

  loadPlugins(bot, playerConfig) {
    if (!this.enabled) {
      console.log('[PluginManager] Plugins disabled');
      return;
    }

    console.log(`[PluginManager] Loading plugins for ${playerConfig.username}...`);

    // Load Lifesteal SMP plugin
    if (this.config.plugins.lifeStealSMP?.enabled) {
      this.loadLifeStealPlugin(bot, playerConfig);
    }
  }

  loadLifeStealPlugin(bot, playerConfig) {
    console.log(`[${playerConfig.username}] Loading Lifesteal SMP plugin...`);

    const pluginConfig = this.config.plugins.lifeStealSMP;
    
    const lifeStealPlugin = {
      name: 'LifestealSMP',
      enabled: true,
      hearts: 10, // Starting hearts
      maxHearts: pluginConfig.maxHearts || 20,
      minHearts: pluginConfig.minHearts || 2,

      onKill: (victim) => {
        if (lifeStealPlugin.hearts < lifeStealPlugin.maxHearts) {
          lifeStealPlugin.hearts++;
          console.log(`[${playerConfig.username}] Gained a heart! Total: ${lifeStealPlugin.hearts}`);
          bot.chat(`I gained a heart from ${victim}! Now at ${lifeStealPlugin.hearts} hearts!`);
        }
      },

      onDeath: () => {
        if (lifeStealPlugin.hearts > lifeStealPlugin.minHearts) {
          lifeStealPlugin.hearts--;
          console.log(`[${playerConfig.username}] Lost a heart! Total: ${lifeStealPlugin.hearts}`);
        }
        
        if (lifeStealPlugin.hearts <= lifeStealPlugin.minHearts) {
          console.log(`[${playerConfig.username}] Eliminated from Lifesteal SMP!`);
          bot.chat('I\'ve been eliminated from the Lifesteal SMP!');
        }
      },

      getHearts: () => lifeStealPlugin.hearts,
      
      setHearts: (amount) => {
        lifeStealPlugin.hearts = Math.max(
          lifeStealPlugin.minHearts,
          Math.min(lifeStealPlugin.maxHearts, amount)
        );
      }
    };

    // Hook into bot events
    bot.on('death', () => {
      lifeStealPlugin.onDeath();
    });

    bot.on('entityDead', (entity) => {
      if (entity.type === 'player' && bot.entity) {
        const distance = bot.entity.position.distanceTo(entity.position);
        if (distance < 5) {
          // Likely killed by this bot
          lifeStealPlugin.onKill(entity.username || 'someone');
        }
      }
    });

    // Listen for lifesteal commands
    bot.on('chat', (username, message) => {
      if (message === '!hearts' || message === '!hp') {
        bot.chat(`I currently have ${lifeStealPlugin.hearts} hearts!`);
      }
    });

    this.plugins.set('lifesteal', lifeStealPlugin);
    console.log(`[${playerConfig.username}] Lifesteal SMP plugin loaded (${lifeStealPlugin.hearts} hearts)`);
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  unloadPlugins() {
    this.plugins.clear();
    console.log('[PluginManager] All plugins unloaded');
  }
}

module.exports = PluginManager;
