# Minecraft Content Pipeline Manager

A multi-bot Minecraft content pipeline project powered by Node.js with an easy-to-use Windows executable launcher.

## Features

- 🎮 **Interactive UI**: Easy-to-use menu-driven interface
- ⚙️ **Configuration Management**: Edit all settings directly from the application
- 🤖 **Bot Management**: Manage multiple Minecraft bots
- 📊 **Status Monitoring**: View system status and configuration
- 🚀 **Pipeline Control**: Start and stop the content pipeline
- 💾 **Persistent Settings**: All configurations are saved automatically

## Installation

### For End Users (Windows)

1. Download the latest release from the releases page
2. Extract `launcher.exe` to your desired location
3. Double-click `launcher.exe` to run the application
4. Configure your settings through the interactive menu

### For Developers

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

## Building the Windows Executable

To build the Windows executable yourself:

```bash
npm install
npm run build
```

The executable will be created at `dist/launcher.exe`.

To build for multiple platforms:

```bash
npm run build:all
```

This will create executables for Windows, Linux, and macOS in the `dist` folder.

## Configuration

All configuration is done through the interactive application menu. Settings are stored in `config/settings.json`.

### Configuration Options

#### Minecraft Server Settings
- **Server Host**: The hostname or IP address of the Minecraft server
- **Server Port**: The port number (default: 25565)
- **Minecraft Version**: The version of Minecraft to connect to

#### Bot Configuration
- **Maximum Bots**: Maximum number of bots to run simultaneously
- **Name Prefix**: Prefix for bot usernames
- **Auto-reconnect**: Automatically reconnect bots on disconnect

#### Content Pipeline Settings
- **Output Directory**: Where to save pipeline output
- **Output Format**: JSON, XML, or CSV
- **Compression**: Enable/disable output compression

#### General Settings
- **Log Level**: debug, info, warn, or error
- **Auto-start**: Automatically start pipeline on launch

## Usage

1. Launch the application (double-click `launcher.exe` on Windows or run `npm start`)
2. Use arrow keys to navigate the menu
3. Press Enter to select an option
4. Follow the prompts to configure settings or manage bots

### Main Menu Options

- **⚙️ Configure Settings**: Edit application configuration
- **🤖 Manage Bots**: Add, remove, or list bots
- **📊 View Status**: View current system status and configuration
- **🚀 Start Pipeline**: Start the content pipeline
- **🛑 Stop Pipeline**: Stop the content pipeline
- **❌ Exit**: Close the application

## Project Structure

```
pro/
├── src/
│   ├── index.js           # Application entry point
│   ├── application.js     # Main application logic
│   ├── configManager.js   # Configuration management
│   └── utils.js           # Utility functions
├── config/
│   ├── settings.json      # User configuration (auto-generated)
│   └── settings.default.json  # Default configuration
├── dist/                  # Built executables (generated)
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Requirements

### For Running the Executable
- Windows 10 or later (for Windows builds)
- No additional dependencies required

### For Development
- Node.js 18 or later
- npm 8 or later

## Troubleshooting

### Configuration Issues
- If settings aren't saving, check that the application has write permissions to the `config` directory
- To reset to default settings, delete `config/settings.json` and restart the application

### Build Issues
- Ensure you have Node.js 18 or later installed
- Run `npm install` to ensure all dependencies are installed
- If `pkg` fails, try updating it: `npm install pkg@latest --save-dev`

## License

MIT

## Author

zmfspotify-rgb

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
