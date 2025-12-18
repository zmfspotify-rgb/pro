# Minecraft Bot Manager Pro 🎮

A professional, feature-rich desktop application for managing multiple Minecraft bots with advanced scheduling and automation capabilities.

## ✨ Features

### 🤖 Bot Management
- **Add unlimited bots** with custom configurations
- **Online/Offline status tracking** with real-time updates
- **Start/Stop controls** for each bot individually
- **Auto-reconnect** functionality to maintain connections
- **Always On mode** - Keep bots connected 24/7 regardless of schedule

### 📅 Streaming Schedule
- **Create custom schedules** for each bot
- **Multi-day scheduling** - Select specific days of the week
- **Time-based automation** - Set start and end times
- **Flexible scheduling** - Bots can run outside their schedule if "Always On" is enabled
- **Schedule override** - Bots with "Always On" stay connected even outside scheduled times

### 🎨 Modern Professional UI
- **Beautiful gradient design** with smooth animations
- **Dark theme** optimized for extended use
- **Intuitive dashboard** with quick stats overview
- **Responsive layout** that adapts to your screen
- **Clean, organized interface** - Not like a coding platform!

### 📊 Dashboard & Analytics
- **Real-time statistics** - Track total, online, offline, and scheduled bots
- **Active bots list** - See which bots are currently connected
- **Quick overview** of your entire bot network

### 📝 Logging System
- **Comprehensive logs** for all bot activities
- **Filter by bot** to view specific bot logs
- **Color-coded log levels** (info, warning, error)
- **Timestamps** for all log entries
- **Auto-scrolling** to latest logs

### 🔧 Additional Features
- **Multiple bot support** - Manage dozens of bots simultaneously
- **Offline mode support** - Run bots without Microsoft authentication
- **Online mode support** - Connect with Microsoft accounts
- **Custom server/port** configuration for each bot
- **Anti-AFK behavior** - Bots automatically look around to stay active
- **Persistent storage** - All settings and bots saved locally

## 🚀 Installation

### For Users (Windows)

1. Download the latest release `.exe` file
2. Run the installer
3. Follow the installation wizard
4. Launch "Minecraft Bot Manager Pro" from your desktop or start menu

### For Developers

1. Clone this repository:
   ```bash
   git clone https://github.com/zmfspotify-rgb/pro.git
   cd pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

4. Build the Windows executable:
   ```bash
   npm run build
   ```

## 📖 How to Use

### Adding a Bot

1. Navigate to the **Bots** section
2. Click **"+ Add Bot"**
3. Fill in the bot details:
   - **Bot Name**: A friendly name for your bot
   - **Username**: Minecraft username
   - **Password**: Leave empty for offline mode, or enter Microsoft account password
   - **Server Address**: The Minecraft server to connect to
   - **Port**: Usually 25565 (default)
   - **Always On**: Enable to keep the bot connected 24/7
   - **Auto Reconnect**: Enable to automatically reconnect if disconnected
4. Click **"Save Bot"**

### Creating a Schedule

1. Navigate to the **Schedule** section
2. Click **"+ Add Schedule"**
3. Configure the schedule:
   - **Select Bot**: Choose which bot to schedule
   - **Days**: Check the days you want the bot to be active
   - **Start Time**: When the bot should connect
   - **End Time**: When the bot should disconnect
4. Click **"Save Schedule"**

**Important**: Bots with "Always On" enabled will stay connected even outside their scheduled times!

### Managing Bots

- **Start Bot**: Click the ▶️ Start button on any offline bot
- **Stop Bot**: Click the ⏹️ Stop button on any online bot
- **Toggle Always On**: Click the ✏️ edit button to toggle "Always On" mode
- **Remove Bot**: Click the 🗑️ delete button to remove a bot

### Viewing Logs

1. Navigate to the **Logs** section
2. Use the dropdown to filter by specific bot or view all logs
3. Click **"Clear"** to clear the log display

## 🎯 Key Features Explained

### Always On Mode
When enabled for a bot:
- ✅ Bot stays connected 24/7
- ✅ Works independently of schedules
- ✅ Auto-reconnects if disconnected
- ✅ Perfect for permanent server presence

### Non-Streaming Bots
As requested, bots can log on and play even when they're not on the streaming schedule:
- Enable **"Always On"** for the bot
- The bot will remain connected outside scheduled streaming times
- This allows background bots to maintain server presence
- Scheduled streaming times can still be used for specific streaming periods

### Offline vs Online Mode
- **Offline Mode**: Leave password empty - bot connects without authentication
- **Online Mode**: Enter Microsoft password - bot authenticates with Mojang/Microsoft

## 🔧 Technical Details

### Built With
- **Electron** - Cross-platform desktop framework
- **Node.js** - JavaScript runtime
- **Mineflayer** - Minecraft bot protocol
- **electron-builder** - Application packaging

### System Requirements
- Windows 10 or later (64-bit)
- 4GB RAM minimum
- Internet connection for bot operations

## 📦 Building from Source

To create the Windows executable:

```bash
# Install dependencies
npm install

# Build for Windows
npm run build
```

The executable will be created in the `dist/` folder.

## 🐛 Troubleshooting

### Bot won't connect
- Check server address and port
- Verify the server is online
- For online mode, ensure password is correct
- Check if the server allows bot connections

### Schedule not working
- Ensure times are set correctly
- Check that days are selected
- Verify the bot isn't in "Always On" mode (unless you want it to override the schedule)

## 📝 License

ISC License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips

- Use **Always On** for lobby bots or permanent presence
- Use **Schedules** for streaming bots that only need to be on at certain times
- Enable **Auto Reconnect** to handle network issues automatically
- Check the **Logs** section regularly to monitor bot health
- The **Dashboard** gives you a quick overview at a glance

---

Made with ❤️ for the Minecraft community

