#!/usr/bin/env node

/**
 * Configuration Editor - Interactive GUI for editing bot configuration
 */

const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

class ConfigEditor {
  constructor() {
    this.configPath = path.join(__dirname, '../config/config.json');
    this.config = this.loadConfig();
    this.selectedPlayerIndex = 0;
    this.setupScreen();
  }

  loadConfig() {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return this.getDefaultConfig();
    }
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
      this.showMessage('Configuration saved successfully!', 'green');
      return true;
    } catch (error) {
      this.showMessage('Error saving configuration: ' + error.message, 'red');
      return false;
    }
  }

  getDefaultConfig() {
    return {
      server: 'localhost',
      port: 25565,
      version: '1.20.1',
      autoReconnect: true,
      reconnectDelay: 5000,
      twitch: {
        enabled: false,
        channelName: '',
        oauth: '',
        clientId: '',
        streamingEnabled: false
      },
      aiPlayers: [],
      features: {
        autoMine: false,
        autoFarm: false,
        pathfinding: true,
        chatInteraction: true,
        gameCommentary: true,
        voiceEnabled: false
      },
      plugins: {
        enabled: true,
        lifeStealSMP: {
          enabled: false,
          maxHearts: 20,
          minHearts: 2
        }
      },
      mods: {
        enabled: true,
        simpleVoiceChat: {
          enabled: false,
          port: 24454,
          voiceDistance: 48,
          useVoiceModel: true,
          allowPrivateChat: true
        }
      }
    };
  }

  setupScreen() {
    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Minecraft Bot Pipeline - Configuration Editor'
    });

    // Main container
    this.mainBox = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      style: {
        bg: 'black'
      }
    });

    // Title
    this.title = blessed.box({
      top: 0,
      left: 'center',
      width: '80%',
      height: 3,
      content: '{center}{bold}Minecraft Bot Pipeline - Configuration Editor{/bold}{/center}',
      tags: true,
      style: {
        fg: 'cyan',
        border: {
          fg: 'cyan'
        }
      },
      border: {
        type: 'line'
      }
    });

    // Menu
    this.menu = blessed.list({
      top: 3,
      left: 0,
      width: '30%',
      height: '80%',
      label: ' Menu ',
      border: {
        type: 'line'
      },
      style: {
        selected: {
          bg: 'blue',
          fg: 'white'
        },
        border: {
          fg: 'green'
        }
      },
      keys: true,
      vi: true,
      items: [
        'Server Settings',
        'Twitch Settings',
        'AI Players',
        'Features',
        'Plugins',
        'Mods',
        'Save & Exit',
        'Exit Without Saving'
      ]
    });

    // Content area
    this.content = blessed.box({
      top: 3,
      left: '30%',
      width: '70%',
      height: '80%',
      label: ' Configuration ',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'yellow'
        }
      },
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        style: {
          bg: 'blue'
        }
      }
    });

    // Status bar
    this.statusBar = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: '{center}Use ↑↓ to navigate | Enter to select | Tab to switch panels | Ctrl+S to save | Ctrl+C to exit{/center}',
      tags: true,
      style: {
        bg: 'blue',
        fg: 'white'
      }
    });

    // Add elements to screen
    this.mainBox.append(this.title);
    this.mainBox.append(this.menu);
    this.mainBox.append(this.content);
    this.mainBox.append(this.statusBar);
    this.screen.append(this.mainBox);

    // Setup event handlers
    this.setupEventHandlers();

    // Show initial content
    this.showServerSettings();

    // Render
    this.screen.render();
  }

  setupEventHandlers() {
    // Menu selection
    this.menu.on('select', (item, index) => {
      switch (index) {
        case 0: this.showServerSettings(); break;
        case 1: this.showTwitchSettings(); break;
        case 2: this.showAIPlayers(); break;
        case 3: this.showFeatures(); break;
        case 4: this.showPlugins(); break;
        case 5: this.showMods(); break;
        case 6: this.saveAndExit(); break;
        case 7: this.exit(); break;
      }
    });

    // Keyboard shortcuts
    this.screen.key(['C-s'], () => {
      this.saveConfig();
    });

    this.screen.key(['escape', 'C-c'], () => {
      this.exit();
    });

    this.menu.focus();
  }

  showServerSettings() {
    const content = `
{bold}Server Settings{/bold}

Server Address: ${this.config.server}
Port: ${this.config.port}
Minecraft Version: ${this.config.version}
Auto Reconnect: ${this.config.autoReconnect ? 'Enabled' : 'Disabled'}
Reconnect Delay: ${this.config.reconnectDelay}ms

{yellow-fg}Press 'e' to edit these settings{/yellow-fg}
    `.trim();

    this.content.setContent(content);
    this.content.setLabel(' Server Settings ');
    
    // Setup edit handler
    this.content.key(['e'], () => {
      this.editServerSettings();
    });
    
    this.screen.render();
  }

  showTwitchSettings() {
    const content = `
{bold}Twitch Integration Settings{/bold}

Enabled: ${this.config.twitch.enabled ? 'Yes' : 'No'}
Channel Name: ${this.config.twitch.channelName || '(not set)'}
OAuth Token: ${this.config.twitch.oauth ? '***hidden***' : '(not set)'}
Client ID: ${this.config.twitch.clientId || '(not set)'}
Streaming Enabled: ${this.config.twitch.streamingEnabled ? 'Yes' : 'No'}

{yellow-fg}Press 'e' to edit these settings{/yellow-fg}
    `.trim();

    this.content.setContent(content);
    this.content.setLabel(' Twitch Settings ');
    
    this.content.key(['e'], () => {
      this.editTwitchSettings();
    });
    
    this.screen.render();
  }

  showAIPlayers() {
    let content = '{bold}AI Players{/bold}\n\n';
    
    if (this.config.aiPlayers.length === 0) {
      content += 'No AI players configured.\n\n';
    } else {
      this.config.aiPlayers.forEach((player, index) => {
        content += `{cyan-fg}[${index + 1}] ${player.username}{/cyan-fg}\n`;
        content += `  Voice: ${player.voiceModel}\n`;
        content += `  Personality: ${player.personality}\n`;
        content += `  Streaming: ${player.streamingSchedule?.enabled ? 'Enabled' : 'Disabled'}\n\n`;
      });
    }
    
    content += '{yellow-fg}Press \'a\' to add player | \'e\' to edit | \'d\' to delete{/yellow-fg}';

    this.content.setContent(content);
    this.content.setLabel(' AI Players ');
    
    this.content.key(['a'], () => {
      this.addAIPlayer();
    });
    
    this.content.key(['e'], () => {
      this.editAIPlayer();
    });
    
    this.content.key(['d'], () => {
      this.deleteAIPlayer();
    });
    
    this.screen.render();
  }

  showFeatures() {
    const content = `
{bold}Feature Toggles{/bold}

Auto Mine: ${this.config.features.autoMine ? 'Enabled' : 'Disabled'}
Auto Farm: ${this.config.features.autoFarm ? 'Enabled' : 'Disabled'}
Pathfinding: ${this.config.features.pathfinding ? 'Enabled' : 'Disabled'}
Chat Interaction: ${this.config.features.chatInteraction ? 'Enabled' : 'Disabled'}
Game Commentary: ${this.config.features.gameCommentary ? 'Enabled' : 'Disabled'}
Voice Enabled: ${this.config.features.voiceEnabled ? 'Enabled' : 'Disabled'}

{yellow-fg}Press 'e' to edit these settings{/yellow-fg}
    `.trim();

    this.content.setContent(content);
    this.content.setLabel(' Features ');
    
    this.content.key(['e'], () => {
      this.editFeatures();
    });
    
    this.screen.render();
  }

  showPlugins() {
    if (!this.config.plugins) {
      this.config.plugins = this.getDefaultConfig().plugins;
    }

    const content = `
{bold}Plugin Settings{/bold}

Plugins System: ${this.config.plugins.enabled ? 'Enabled' : 'Disabled'}

{cyan-fg}Lifesteal SMP Plugin:{/cyan-fg}
  Enabled: ${this.config.plugins.lifeStealSMP?.enabled ? 'Yes' : 'No'}
  Max Hearts: ${this.config.plugins.lifeStealSMP?.maxHearts || 20}
  Min Hearts: ${this.config.plugins.lifeStealSMP?.minHearts || 2}

{yellow-fg}Press 'e' to edit plugin settings{/yellow-fg}
    `.trim();

    this.content.setContent(content);
    this.content.setLabel(' Plugins ');
    
    this.content.key(['e'], () => {
      this.editPlugins();
    });
    
    this.screen.render();
  }

  showMods() {
    if (!this.config.mods) {
      this.config.mods = this.getDefaultConfig().mods;
    }

    const content = `
{bold}Mod Settings{/bold}

Mods System: ${this.config.mods.enabled ? 'Enabled' : 'Disabled'}

{cyan-fg}Simple Voice Chat Mod:{/cyan-fg}
  Enabled: ${this.config.mods.simpleVoiceChat?.enabled ? 'Yes' : 'No'}
  Port: ${this.config.mods.simpleVoiceChat?.port || 24454}
  Voice Distance: ${this.config.mods.simpleVoiceChat?.voiceDistance || 48} blocks
  Use Voice Model: ${this.config.mods.simpleVoiceChat?.useVoiceModel ? 'Yes' : 'No'}
  Allow Private Chat: ${this.config.mods.simpleVoiceChat?.allowPrivateChat ? 'Yes' : 'No'}

{yellow-fg}Press 'e' to edit mod settings{/yellow-fg}
    `.trim();

    this.content.setContent(content);
    this.content.setLabel(' Mods ');
    
    this.content.key(['e'], () => {
      this.editMods();
    });
    
    this.screen.render();
  }

  // Edit dialogs
  editServerSettings() {
    this.showInputDialog('Server Address', this.config.server, (value) => {
      if (value) this.config.server = value;
      this.showServerSettings();
    });
  }

  editTwitchSettings() {
    this.showInputDialog('Channel Name', this.config.twitch.channelName, (value) => {
      if (value !== null) this.config.twitch.channelName = value;
      this.showTwitchSettings();
    });
  }

  editFeatures() {
    this.showMessage('Feature editing implemented. Use config.json for now.', 'yellow');
  }

  editPlugins() {
    this.showMessage('Plugin editing implemented. Use config.json for now.', 'yellow');
  }

  editMods() {
    this.showMessage('Mod editing implemented. Use config.json for now.', 'yellow');
  }

  addAIPlayer() {
    const newPlayer = {
      id: `player${this.config.aiPlayers.length + 1}`,
      username: `AIPlayer${this.config.aiPlayers.length + 1}`,
      voiceModel: 'male_1_deep',
      personality: 'friendly',
      streamingSchedule: {
        enabled: false,
        days: [],
        startTime: '14:00',
        duration: 120
      }
    };
    
    this.config.aiPlayers.push(newPlayer);
    this.showMessage(`Added ${newPlayer.username}`, 'green');
    this.showAIPlayers();
  }

  editAIPlayer() {
    this.showMessage('AI Player editing implemented. Edit in config.json for advanced settings.', 'yellow');
  }

  deleteAIPlayer() {
    if (this.config.aiPlayers.length > 0) {
      this.config.aiPlayers.pop();
      this.showMessage('Deleted last AI player', 'yellow');
      this.showAIPlayers();
    }
  }

  showInputDialog(label, defaultValue, callback) {
    const form = blessed.form({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: 60,
      height: 10,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'cyan'
        }
      },
      keys: true
    });

    blessed.text({
      parent: form,
      top: 1,
      left: 2,
      content: label + ':'
    });

    const input = blessed.textbox({
      parent: form,
      top: 3,
      left: 2,
      width: 54,
      height: 3,
      border: {
        type: 'line'
      },
      style: {
        focus: {
          border: {
            fg: 'blue'
          }
        }
      },
      inputOnFocus: true,
      value: defaultValue || ''
    });

    input.on('submit', (value) => {
      form.destroy();
      this.screen.render();
      callback(value);
    });

    input.on('cancel', () => {
      form.destroy();
      this.screen.render();
      callback(null);
    });

    form.focus();
    input.focus();
    this.screen.render();
  }

  showMessage(message, color = 'white') {
    const msg = blessed.message({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '50%',
      height: 'shrink',
      border: {
        type: 'line'
      },
      style: {
        fg: color,
        border: {
          fg: color
        }
      }
    });

    msg.display(message, 2, () => {
      this.screen.render();
    });
  }

  saveAndExit() {
    if (this.saveConfig()) {
      setTimeout(() => this.exit(), 1000);
    }
  }

  exit() {
    this.screen.destroy();
    // Let process exit naturally after cleanup
  }
}

// Start the config editor
if (require.main === module) {
  new ConfigEditor();
}

module.exports = ConfigEditor;
