const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    // Determine the application root directory
    // When bundled with pkg, use process.cwd()
    // When run normally, use the directory containing the main script
    let appDir;
    if (process.pkg) {
      // Running as packaged executable
      appDir = path.dirname(process.execPath);
    } else if (require.main) {
      // Running as regular Node.js app
      appDir = path.dirname(require.main.filename);
    } else {
      // Fallback to current working directory
      appDir = process.cwd();
    }
    
    this.configPath = path.join(appDir, 'config', 'settings.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      // Create config directory if it doesn't exist
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // Load existing config or create default
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(data);
      } else {
        return this.getDefaultConfig();
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      minecraft: {
        serverHost: 'localhost',
        serverPort: '25565',
        version: '1.20.1'
      },
      bots: {
        maxBots: 5,
        namePrefix: 'Bot',
        autoReconnect: true
      },
      pipeline: {
        outputDirectory: './output',
        format: 'JSON',
        compression: true
      },
      general: {
        logLevel: 'info',
        autoStart: false
      }
    };
  }

  saveConfig() {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving config:', error.message);
      return false;
    }
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    this.saveConfig();
  }

  getAll() {
    return this.config;
  }

  reset() {
    this.config = this.getDefaultConfig();
    this.saveConfig();
  }
}

module.exports = ConfigManager;
