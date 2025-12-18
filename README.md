# Minecraft Bot Pipeline

A multi-bot Minecraft content pipeline project powered by Node.js

## 🚀 Quick Start

### Using the .exe Launcher (Windows)

1. Download the latest `launcher.exe` from the [Releases](../../releases) page
2. Double-click `launcher.exe` to start the bot pipeline
3. Configure your settings in `config/config.json`

### Building the .exe Launcher

To create the `launcher.exe` file yourself:

```bash
# Install dependencies
npm install

# Build the .exe launcher for Windows
npm run build
```

The `launcher.exe` file will be created in the `dist/` directory.

### Running from Source

```bash
# Install dependencies
npm install

# Run the application
npm start
```

## ⚙️ Configuration

Edit `config/config.json` to customize your bot settings:

```json
{
  "botName": "MinecraftBot",
  "server": "localhost",
  "port": 25565,
  "version": "1.20.1",
  "autoReconnect": true,
  "reconnectDelay": 5000
}
```

## 📦 Build Commands

- `npm run build` - Build Windows .exe launcher
- `npm run build:all` - Build launchers for Windows, Linux, and macOS
- `npm start` - Run the application directly with Node.js

## 📝 License

MIT
