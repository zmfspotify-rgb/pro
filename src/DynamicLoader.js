/**
 * Dynamic Plugin/Mod Loader - Automatically discovers and learns uploaded plugins/mods
 */

const fs = require('fs');
const path = require('path');

class DynamicLoader {
  constructor(memorySystem) {
    this.memorySystem = memorySystem;
    this.pluginsDir = path.join(__dirname, '../plugins');
    this.modsDir = path.join(__dirname, '../mods');
    this.loadedPlugins = new Map();
    this.loadedMods = new Map();
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.pluginsDir, this.modsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Scan and discover uploaded plugins
  async discoverPlugins() {
    console.log('[DynamicLoader] Scanning for uploaded plugins...');
    
    try {
      const files = fs.readdirSync(this.pluginsDir);
      
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.jar')) {
          await this.analyzePlugin(file);
        }
      }
      
      console.log(`[DynamicLoader] Discovered ${this.loadedPlugins.size} plugins`);
    } catch (error) {
      console.error('[DynamicLoader] Error discovering plugins:', error.message);
    }
  }

  // Scan and discover uploaded mods
  async discoverMods() {
    console.log('[DynamicLoader] Scanning for uploaded mods...');
    
    try {
      const files = fs.readdirSync(this.modsDir);
      
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.jar')) {
          await this.analyzeMod(file);
        }
      }
      
      console.log(`[DynamicLoader] Discovered ${this.loadedMods.size} mods`);
    } catch (error) {
      console.error('[DynamicLoader] Error discovering mods:', error.message);
    }
  }

  // Analyze plugin to understand capabilities
  async analyzePlugin(filename) {
    const pluginPath = path.join(this.pluginsDir, filename);
    const pluginName = path.basename(filename, path.extname(filename));
    
    console.log(`[DynamicLoader] Analyzing plugin: ${pluginName}`);

    try {
      let capabilities = {
        name: pluginName,
        type: 'plugin',
        filename: filename,
        commands: [],
        features: [],
        events: []
      };

      // For .js files, try to analyze the code
      if (filename.endsWith('.js')) {
        const code = fs.readFileSync(pluginPath, 'utf8');
        
        // Extract commands (look for command patterns)
        const commandMatches = code.match(/command['"]?\s*:\s*['"](\w+)['"]/gi) || [];
        const cmdMatches = code.match(/cmd\s*[=:]\s*['"](\w+)['"]/gi) || [];
        const onMatches = code.match(/on\s*\(\s*['"](\w+)['"]\s*\)/gi) || [];
        
        const allCommands = [...commandMatches, ...cmdMatches, ...onMatches].map(m => {
          const match = m.match(/['"](\w+)['"]/);
          return match ? match[1] : null;
        }).filter(Boolean);
        
        capabilities.commands = [...new Set(allCommands)];

        // Extract features (look for function definitions)
        const functionMatches = code.match(/function\s+(\w+)/g) || [];
        capabilities.features = functionMatches.map(m => m.replace('function ', ''));

        // Extract event listeners
        const eventMatches = code.match(/on\(['"](\w+)['"]/g) || [];
        capabilities.events = [...new Set(eventMatches.map(m =>
          m.replace(/on\(['"](\w+)['"]/, '$1')
        ))];
      }

      // For .jar files, use basic metadata
      if (filename.endsWith('.jar')) {
        capabilities.features.push('server-side-plugin');
        capabilities.commands.push('!help'); // Most plugins have help
      }

      this.loadedPlugins.set(pluginName, capabilities);
      
      // Teach AI about this plugin
      if (this.memorySystem) {
        this.memorySystem.learnPlugin(pluginName, capabilities);
      }

      return capabilities;
    } catch (error) {
      console.error(`[DynamicLoader] Error analyzing plugin ${pluginName}:`, error.message);
      return null;
    }
  }

  // Analyze mod to understand capabilities
  async analyzeMod(filename) {
    const modPath = path.join(this.modsDir, filename);
    const modName = path.basename(filename, path.extname(filename));
    
    console.log(`[DynamicLoader] Analyzing mod: ${modName}`);

    try {
      let capabilities = {
        name: modName,
        type: 'mod',
        filename: filename,
        commands: [],
        features: [],
        keybinds: []
      };

      // For .js files, try to analyze the code
      if (filename.endsWith('.js')) {
        const code = fs.readFileSync(modPath, 'utf8');
        
        // Extract commands
        const commandMatches = code.match(/\/(\w+)/g) || [];
        capabilities.commands = [...new Set(commandMatches.map(m => {
          const match = m.match(/\/(\w+)/);
          return match ? match[0] : null; // Keep the /command format
        }).filter(Boolean))];

        // Extract features
        const functionMatches = code.match(/function\s+(\w+)/g) || [];
        capabilities.features = functionMatches.map(m => m.replace('function ', ''));

        // Extract keybinds
        const keybindMatches = code.match(/key[Bb]ind|register[Kk]ey/g) || [];
        if (keybindMatches.length > 0) {
          capabilities.features.push('has_keybinds');
        }
      }

      // For .jar files, use basic metadata
      if (filename.endsWith('.jar')) {
        capabilities.features.push('client-side-mod');
      }

      this.loadedMods.set(modName, capabilities);
      
      // Teach AI about this mod
      if (this.memorySystem) {
        this.memorySystem.learnMod(modName, capabilities);
      }

      return capabilities;
    } catch (error) {
      console.error(`[DynamicLoader] Error analyzing mod ${modName}:`, error.message);
      return null;
    }
  }

  // AI figures out how to use a plugin
  async learnPluginUsage(bot, pluginName) {
    const plugin = this.loadedPlugins.get(pluginName);
    
    if (!plugin) {
      console.log(`[DynamicLoader] Plugin ${pluginName} not found`);
      return false;
    }

    console.log(`[DynamicLoader] AI learning how to use plugin: ${pluginName}`);

    // Try discovered commands
    for (const command of plugin.commands) {
      try {
        console.log(`[DynamicLoader] Testing command: ${command}`);
        
        // Test the command
        if (bot && bot.chat) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          bot.chat(command);
          
          // Record usage
          if (this.memorySystem) {
            this.memorySystem.recordUsage('plugin', pluginName, command, {
              success: true,
              tested: true
            });
          }
        }
      } catch (error) {
        console.error(`[DynamicLoader] Error testing command ${command}:`, error.message);
        
        if (this.memorySystem) {
          this.memorySystem.recordUsage('plugin', pluginName, command, {
            success: false,
            error: error.message
          });
        }
      }
    }

    return true;
  }

  // AI figures out how to use a mod
  async learnModUsage(bot, modName) {
    const mod = this.loadedMods.get(modName);
    
    if (!mod) {
      console.log(`[DynamicLoader] Mod ${modName} not found`);
      return false;
    }

    console.log(`[DynamicLoader] AI learning how to use mod: ${modName}`);

    // Try discovered commands
    for (const command of mod.commands) {
      try {
        console.log(`[DynamicLoader] Testing mod command: ${command}`);
        
        // Test the command
        if (bot && bot.chat) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          bot.chat(command);
          
          // Record usage
          if (this.memorySystem) {
            this.memorySystem.recordUsage('mod', modName, command, {
              success: true,
              tested: true
            });
          }
        }
      } catch (error) {
        console.error(`[DynamicLoader] Error testing mod command ${command}:`, error.message);
        
        if (this.memorySystem) {
          this.memorySystem.recordUsage('mod', modName, command, {
            success: false,
            error: error.message
          });
        }
      }
    }

    return true;
  }

  // Get all discovered plugins
  getDiscoveredPlugins() {
    return Array.from(this.loadedPlugins.values());
  }

  // Get all discovered mods
  getDiscoveredMods() {
    return Array.from(this.loadedMods.values());
  }

  // Get capabilities of specific plugin/mod
  getCapabilities(type, name) {
    if (type === 'plugin') {
      return this.loadedPlugins.get(name);
    } else if (type === 'mod') {
      return this.loadedMods.get(name);
    }
    return null;
  }

  // AI automatically experiments with plugin/mod
  async autoLearn(bot, type, name) {
    console.log(`[DynamicLoader] AI auto-learning ${type}: ${name}`);
    
    if (type === 'plugin') {
      return await this.learnPluginUsage(bot, name);
    } else if (type === 'mod') {
      return await this.learnModUsage(bot, name);
    }
    
    return false;
  }

  // Re-scan for new uploads
  async rescan() {
    console.log('[DynamicLoader] Rescanning for new plugins/mods...');
    await this.discoverPlugins();
    await this.discoverMods();
  }
}

module.exports = DynamicLoader;
