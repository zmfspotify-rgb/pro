const inquirer = require('inquirer');
const chalk = require('chalk');
const ConfigManager = require('./configManager');
const { displayBanner, clearScreen } = require('./utils');

class Application {
  constructor() {
    this.config = new ConfigManager();
    this.running = true;
  }

  async start() {
    clearScreen();
    displayBanner();
    await this.mainMenu();
  }

  async mainMenu() {
    while (this.running) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '⚙️  Configure Settings', value: 'configure' },
            { name: '🤖 Manage Bots', value: 'bots' },
            { name: '📊 View Status', value: 'status' },
            { name: '🚀 Start Pipeline', value: 'start' },
            { name: '🛑 Stop Pipeline', value: 'stop' },
            new inquirer.Separator(),
            { name: '❌ Exit', value: 'exit' }
          ]
        }
      ]);

      switch (action) {
        case 'configure':
          await this.configureSettings();
          break;
        case 'bots':
          await this.manageBots();
          break;
        case 'status':
          await this.viewStatus();
          break;
        case 'start':
          await this.startPipeline();
          break;
        case 'stop':
          await this.stopPipeline();
          break;
        case 'exit':
          this.running = false;
          console.log(chalk.green('\n👋 Goodbye!\n'));
          break;
      }
    }
  }

  async configureSettings() {
    clearScreen();
    console.log(chalk.cyan.bold('\n⚙️  Configuration Settings\n'));

    const currentConfig = this.config.getAll();
    
    const { settings } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'settings',
        message: 'Select settings to edit:',
        choices: [
          { name: 'Minecraft Server Settings', value: 'minecraft', checked: false },
          { name: 'Bot Configuration', value: 'bots', checked: false },
          { name: 'Content Pipeline Settings', value: 'pipeline', checked: false },
          { name: 'General Settings', value: 'general', checked: false }
        ]
      }
    ]);

    if (settings.includes('minecraft')) {
      await this.editMinecraftSettings();
    }
    if (settings.includes('bots')) {
      await this.editBotSettings();
    }
    if (settings.includes('pipeline')) {
      await this.editPipelineSettings();
    }
    if (settings.includes('general')) {
      await this.editGeneralSettings();
    }

    console.log(chalk.green('\n✓ Settings saved successfully!\n'));
    await this.pressAnyKey();
  }

  async editMinecraftSettings() {
    const currentConfig = this.config.get('minecraft') || {};
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'serverHost',
        message: 'Minecraft Server Host:',
        default: currentConfig.serverHost || 'localhost'
      },
      {
        type: 'input',
        name: 'serverPort',
        message: 'Minecraft Server Port:',
        default: currentConfig.serverPort || '25565',
        validate: (input) => {
          const port = parseInt(input);
          return (port > 0 && port < 65536) || 'Please enter a valid port number';
        }
      },
      {
        type: 'input',
        name: 'version',
        message: 'Minecraft Version:',
        default: currentConfig.version || '1.20.1'
      }
    ]);

    this.config.set('minecraft', answers);
  }

  async editBotSettings() {
    const currentConfig = this.config.get('bots') || {};
    
    const answers = await inquirer.prompt([
      {
        type: 'number',
        name: 'maxBots',
        message: 'Maximum number of bots:',
        default: currentConfig.maxBots || 5,
        validate: (input) => input > 0 || 'Must be greater than 0'
      },
      {
        type: 'input',
        name: 'namePrefix',
        message: 'Bot name prefix:',
        default: currentConfig.namePrefix || 'Bot'
      },
      {
        type: 'confirm',
        name: 'autoReconnect',
        message: 'Auto-reconnect on disconnect?',
        default: currentConfig.autoReconnect !== false
      }
    ]);

    this.config.set('bots', answers);
  }

  async editPipelineSettings() {
    const currentConfig = this.config.get('pipeline') || {};
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'outputDirectory',
        message: 'Output directory for content:',
        default: currentConfig.outputDirectory || './output'
      },
      {
        type: 'list',
        name: 'format',
        message: 'Output format:',
        choices: ['JSON', 'XML', 'CSV'],
        default: currentConfig.format || 'JSON'
      },
      {
        type: 'confirm',
        name: 'compression',
        message: 'Enable compression?',
        default: currentConfig.compression !== false
      }
    ]);

    this.config.set('pipeline', answers);
  }

  async editGeneralSettings() {
    const currentConfig = this.config.get('general') || {};
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'logLevel',
        message: 'Log Level:',
        choices: ['debug', 'info', 'warn', 'error'],
        default: currentConfig.logLevel || 'info'
      },
      {
        type: 'confirm',
        name: 'autoStart',
        message: 'Auto-start pipeline on launch?',
        default: currentConfig.autoStart || false
      }
    ]);

    this.config.set('general', answers);
  }

  async manageBots() {
    clearScreen();
    console.log(chalk.cyan.bold('\n🤖 Bot Management\n'));
    
    const botConfig = this.config.get('bots') || {};
    console.log(chalk.white('Current Settings:'));
    console.log(chalk.gray(`  Max Bots: ${botConfig.maxBots || 5}`));
    console.log(chalk.gray(`  Name Prefix: ${botConfig.namePrefix || 'Bot'}`));
    console.log(chalk.gray(`  Auto-reconnect: ${botConfig.autoReconnect !== false ? 'Yes' : 'No'}\n`));

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Bot Action:',
        choices: [
          { name: 'Add Bot', value: 'add' },
          { name: 'Remove Bot', value: 'remove' },
          { name: 'List Bots', value: 'list' },
          { name: 'Back to Main Menu', value: 'back' }
        ]
      }
    ]);

    if (action !== 'back') {
      console.log(chalk.yellow('\n⚠️  Bot management functionality coming soon!\n'));
    }
    
    await this.pressAnyKey();
  }

  async viewStatus() {
    clearScreen();
    console.log(chalk.cyan.bold('\n📊 System Status\n'));
    
    const config = this.config.getAll();
    
    console.log(chalk.white('Configuration:'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(JSON.stringify(config, null, 2));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(chalk.yellow('\n⚠️  Pipeline is not running\n'));
    
    await this.pressAnyKey();
  }

  async startPipeline() {
    clearScreen();
    console.log(chalk.cyan.bold('\n🚀 Starting Pipeline...\n'));
    console.log(chalk.yellow('⚠️  Pipeline functionality coming soon!\n'));
    await this.pressAnyKey();
  }

  async stopPipeline() {
    clearScreen();
    console.log(chalk.cyan.bold('\n🛑 Stopping Pipeline...\n'));
    console.log(chalk.yellow('⚠️  Pipeline functionality coming soon!\n'));
    await this.pressAnyKey();
  }

  async pressAnyKey() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }
}

module.exports = Application;
