# Getting Started Guide

Welcome to the Minecraft Multi-Bot Content Pipeline! This guide will help you get up and running quickly.

## 📦 Installation

```bash
# Clone the repository (if needed)
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro

# Install dependencies
npm install
```

## 🎮 Quick Start - Node.js Backend

### Option 1: Run the Demo (Recommended for First Time)
```bash
npm run demo
```
This shows all features without actually connecting to a server.

### Option 2: Run Tests
```bash
npm test
```
Verify all components are working correctly.

### Option 3: Start the Bot System
```bash
# Start with default settings (localhost)
npm start

# Connect to your Aternos server
MC_HOST=yourserver.aternos.me npm start

# Auto-start with demo bots
AUTO_START=true npm start
```

## 🤖 Creating Your First Bot

### Example 1: Simple Bot
```javascript
import { BotManager } from './src/botManager.js';

const botManager = new BotManager();

// Configure your server
botManager.setServerConfig({
  host: 'yourserver.aternos.me',
  port: 25565,
  version: '1.20.1'
});

// Create a bot
const bot = botManager.createBot({
  username: 'MyFirstBot',
  personalityType: 'explorer',
  voicePresetId: 'm3'
});
```

### Example 2: 24/7 Server Keeper
```javascript
// Create a bot to keep your Aternos server alive
botManager.create24x7Player('ServerKeeper');
```

### Example 3: Scheduled Bot
```javascript
import { createPeakHoursSchedule } from './src/streamingSchedule.js';

botManager.createBot({
  username: 'StreamBot',
  personalityType: 'trader',
  voicePresetId: 'f2',
  schedule: createPeakHoursSchedule() // Online during peak hours
});
```

## 🎤 Voice Presets

Choose from 16 voice presets when creating bots:

**Male Voices**: m1, m2, m3, m4, m5, m6, m7, m8  
**Female Voices**: f1, f2, f3, f4, f5, f6, f7, f8

```javascript
// Use a specific voice
voicePresetId: 'm1'  // Deep Commander

// Or let the system choose randomly
voicePresetId: null  // Random voice assigned
```

Run `npm run demo` to see all voice preset descriptions.

## 🧠 Personality Types

Choose from 8 personality types:

1. **explorer** - Mining, exploring, collecting
2. **builder** - Building, crafting, organizing
3. **warrior** - Fighting, hunting, protecting
4. **farmer** - Farming, breeding, gardening
5. **trader** - Trading, collecting, bartering
6. **redstoner** - Redstone, engineering, automation
7. **adventurer** - Questing, exploring, looting
8. **guardian** - Patrolling, protecting, watching

```javascript
personalityType: 'explorer'
```

## 📅 Scheduling Bots

### 24/7 Mode
```javascript
import { create24x7Schedule } from './src/streamingSchedule.js';

schedule: create24x7Schedule()
```

### Peak Hours (12-4 PM, 6-11 PM)
```javascript
import { createPeakHoursSchedule } from './src/streamingSchedule.js';

schedule: createPeakHoursSchedule()
```

### Weekdays Only
```javascript
import { createWeekdaySchedule } from './src/streamingSchedule.js';

schedule: createWeekdaySchedule()
```

### Custom Schedule
```javascript
schedule: {
  enabled: true,
  mode: 'scheduled',
  days: [0, 1, 2, 3, 4, 5, 6], // 0=Sunday, 6=Saturday
  timeRanges: [
    { start: "09:00", end: "12:00" },
    { start: "18:00", end: "22:00" }
  ]
}
```

## 📱 iOS App (Signulous Installation)

### Building the .ipa

1. **Prepare Build Files**
   ```bash
   npm run build:ios
   ```

2. **Build in Xcode** (macOS required)
   - Open `ios/MinecraftBotPipeline.xcodeproj`
   - Configure code signing
   - Product > Archive
   - Export as .ipa

3. **Install via Signulous**
   - Transfer .ipa to iOS device
   - Open Signulous app
   - Import and install
   - See `build/IPA_INSTALLATION_GUIDE.md` for details

## 🔧 Configuration

### Environment Variables
```bash
MC_HOST=localhost          # Minecraft server host
MC_PORT=25565              # Minecraft server port
MC_VERSION=1.20.1          # Minecraft version
ENABLE_24X7=true           # Enable 24/7 keeper
AUTO_START=false           # Auto-start demo bots
```

### Configuration File
Copy and customize `config.example.js`:
```javascript
export default {
  server: {
    host: 'yourserver.aternos.me',
    port: 25565,
    version: '1.20.1'
  },
  bots: [
    // Your bot configurations
  ]
};
```

## 💡 Tips & Tricks

### For Aternos Servers
1. Enable the 24/7 AI player to keep server running
2. Use scheduled bots to manage resource usage
3. Set server to offline mode if authentication isn't needed

### Bot Naming
- Use descriptive names (Explorer_Alice, Builder_Bob)
- Keep names under 16 characters for Minecraft compatibility
- Avoid special characters

### Memory Management
- Bots remember up to 50 recent events
- Long-term memories persist across sessions
- Export/import memory for backup

### Troubleshooting
1. Check server is running and accessible
2. Verify Minecraft version compatibility
3. Ensure correct server host/port
4. Check firewall settings for server access

## 📚 Documentation

- **DOCUMENTATION.md** - Complete feature documentation
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **SECURITY.md** - Security notes
- **build/IPA_INSTALLATION_GUIDE.md** - iOS installation guide
- **ios/README.md** - iOS app documentation

## 🎉 Next Steps

1. ✅ Run `npm run demo` to see all features
2. ✅ Run `npm test` to verify installation
3. ✅ Configure your server in environment variables
4. ✅ Create your first bot
5. ✅ Build the iOS app (optional)

Need help? Check the documentation files or run the demo!

---

**Happy Bot Building! 🤖**
