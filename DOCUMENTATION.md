# Minecraft Multi-Bot Content Pipeline

A comprehensive multi-bot Minecraft content pipeline with AI personalities, voice models, and 24/7 server management.

## 🎯 Features

### ✅ Bot Creation Functionality
- **Working bot creation system** using Mineflayer
- Create unlimited bots with unique configurations
- Each bot is fully autonomous and interactive
- Supports offline mode and online servers

### 🎤 16 Voice Model Presets
Perfect for when you can't find a good voice model!

#### 8 Male Voice Presets (m1-m8)
1. **m1: Deep Commander** - Deep, commanding voice with authority
2. **m2: Friendly Guide** - Warm, approachable male voice
3. **m3: Young Explorer** - Energetic, youthful male voice
4. **m4: Wise Mentor** - Mature, experienced voice with wisdom
5. **m5: Action Hero** - Bold, confident action-oriented voice
6. **m6: Tech Expert** - Precise, technical male voice
7. **m7: Storyteller** - Expressive, dramatic narrative voice
8. **m8: Casual Buddy** - Laid-back, friendly companion voice

#### 8 Female Voice Presets (f1-f8)
1. **f1: Elegant Leader** - Refined, authoritative female voice
2. **f2: Cheerful Friend** - Bright, cheerful female voice
3. **f3: Mysterious Sage** - Enigmatic, wise female voice
4. **f4: Adventurous Spirit** - Bold, adventurous female voice
5. **f5: Gentle Healer** - Soothing, caring female voice
6. **f6: Tactical Strategist** - Sharp, strategic female voice
7. **f7: Energetic Performer** - Dynamic, high-energy female voice
8. **f8: Calm Narrator** - Peaceful, narrative female voice

### 📅 Streaming Schedule System
Bots can **hop off anytime and hop on later** based on their schedule!

- **24/7 Mode** - Always online
- **Peak Hours** - Active during streaming hours (12-4 PM, 6-11 PM)
- **Weekday Schedule** - Monday-Friday, 9 AM - 5 PM
- **Weekend Schedule** - Saturday-Sunday, 10 AM - 10 PM
- **Custom Schedules** - Define your own time ranges and days

### 🤖 24/7 AI Player
Keeps your **Aternos server online 24/7**!

- Automatically connects and stays online
- Performs periodic activity to prevent AFK kicks
- Ensures server never goes to sleep
- Dedicated "AI_ServerKeeper" bot

### 🧠 AI Player Memories & Personalities

#### 8 Personality Types
1. **Explorer** - Loves to explore and discover new places
2. **Builder** - Focused on construction and creating structures
3. **Warrior** - Combat-oriented, protects the group
4. **Farmer** - Peaceful farmer who tends to crops and animals
5. **Trader** - Social trader who loves to interact and exchange
6. **Redstoner** - Technical expert in redstone and automation
7. **Adventurer** - Seeks adventure and treasure
8. **Guardian** - Vigilant protector of the base

#### Memory System
- **Short-term memory** - Remembers recent events (last 50 actions)
- **Long-term memory** - Stores:
  - Player relationships (tracks friendship levels)
  - Location memories (coordinates and descriptions)
  - Events and achievements
- **Relationship tracking** - Builds relationships with players over time
- **Context-aware responses** - Responds based on personality and memories

## 📱 iOS App (.ipa for Signulous)

The iOS app is ready for deployment via **Signulous**!

### App Features
- Bot creation interface
- Voice preset selector (16 presets)
- 24/7 player controls
- Server configuration
- Real-time status monitoring

### Installation via Signulous
1. Download `MinecraftBotPipeline.ipa` from the build directory
2. Open Signulous app on your iOS device
3. Import the .ipa file
4. Install and trust the developer certificate
5. Launch the app!

See `build/IPA_INSTALLATION_GUIDE.md` for detailed instructions.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run the bot system
npm start

# Run with auto-start demo bots
AUTO_START=true npm start

# Build iOS app
npm run build:ios
```

### Environment Variables

```bash
MC_HOST=your.server.com    # Minecraft server host (default: localhost)
MC_PORT=25565              # Minecraft server port (default: 25565)
MC_VERSION=1.20.1          # Minecraft version (default: 1.20.1)
ENABLE_24X7=true           # Enable 24/7 keeper bot (default: true)
AUTO_START=false           # Auto-start demo bots (default: false)
```

### Creating a Bot

```javascript
import { BotManager } from './src/botManager.js';

const botManager = new BotManager();

// Configure server
botManager.setServerConfig({
  host: 'your.aternos.server',
  port: 25565,
  version: '1.20.1'
});

// Create a bot with personality and voice
const bot = botManager.createBot({
  username: 'MyBot',
  personalityType: 'explorer',  // explorer, builder, warrior, farmer, etc.
  voicePresetId: 'm1',          // m1-m8 (male) or f1-f8 (female)
  schedule: {
    enabled: true,
    mode: 'scheduled',          // 'always', 'scheduled', or 'manual'
    days: [0, 1, 2, 3, 4, 5, 6],
    timeRanges: [
      { start: "12:00", end: "16:00" },
      { start: "18:00", end: "23:00" }
    ]
  }
});

// Create a 24/7 AI player to keep server alive
botManager.create24x7Player('ServerKeeper');
```

## 📂 Project Structure

```
pro/
├── src/
│   ├── index.js              # Main entry point
│   ├── botManager.js         # Bot creation and management
│   ├── voicePresets.js       # 16 voice model presets
│   ├── aiPersonality.js      # AI personalities and memory
│   └── streamingSchedule.js  # Schedule management
├── ios/
│   └── MinecraftBotPipeline/ # iOS app source
│       ├── Info.plist
│       ├── AppDelegate.swift
│       └── ViewController.swift
├── scripts/
│   └── build-ios.js          # iOS build script
├── build/                    # Build output directory
│   ├── MinecraftBotPipeline.ipa
│   └── IPA_INSTALLATION_GUIDE.md
├── package.json
└── README.md
```

## 🎮 Bot Behaviors

Each bot acts according to its personality:

- **Chattiness** - How often they respond to chat (0.0 - 1.0)
- **Friendliness** - How friendly they are to players (0.0 - 1.0)
- **Aggression** - Combat behavior level (0.0 - 1.0)
- **Behaviors** - Preferred activities (mining, building, fighting, etc.)

Bots will:
- Greet players they have good relationships with
- Respond to chat based on personality
- Remember interactions with players
- Perform activities based on their personality type
- Follow their streaming schedule

## 🔧 Technical Details

### Dependencies
- **mineflayer** - Minecraft bot framework
- **mineflayer-pathfinder** - Pathfinding and navigation
- **minecraft-protocol** - Minecraft protocol implementation

### Memory Persistence
Bot memories can be exported and imported for persistence across restarts.

```javascript
// Export memory
const memoryData = bot.memory.export();
// Save to file or database

// Import memory
bot.memory.import(memoryData);
```

### Schedule Management
The system checks schedules every minute and automatically:
- Starts bots that should be online
- Stops bots that should be offline
- Keeps 24/7 bots always running

## 📋 Complete Feature Checklist

- ✅ Node.js project with package.json
- ✅ Bot creation functionality (working!)
- ✅ 16 voice model presets (8 male, 8 female)
- ✅ 8 AI personality types
- ✅ Streaming schedule system (bots hop on/off)
- ✅ 24/7 AI player for Aternos server
- ✅ AI memory system (short-term & long-term)
- ✅ Relationship tracking with players
- ✅ iOS app structure for Signulous
- ✅ .ipa build configuration
- ✅ Comprehensive documentation

## 🎉 All Features from Previous Agent Preserved

This implementation maintains backward compatibility and enhances the system with:
- Improved bot management
- Enhanced AI capabilities
- Better schedule control
- iOS mobile app interface

## 💡 Usage Examples

### Example 1: Content Creation Setup
```javascript
// Create multiple bots for content pipeline
botManager.createBot({ username: 'Miner1', personalityType: 'explorer', voicePresetId: 'm3' });
botManager.createBot({ username: 'Builder1', personalityType: 'builder', voicePresetId: 'f1' });
botManager.createBot({ username: 'Fighter1', personalityType: 'warrior', voicePresetId: 'm5' });

// Add 24/7 keeper
botManager.create24x7Player();
```

### Example 2: Scheduled Streaming
```javascript
import { createPeakHoursSchedule } from './src/streamingSchedule.js';

// Bot only online during peak hours
botManager.createBot({
  username: 'StreamBot',
  personalityType: 'trader',
  voicePresetId: 'f2',
  schedule: createPeakHoursSchedule()
});
```

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review the code examples
3. See build/IPA_INSTALLATION_GUIDE.md for iOS installation

## 📄 License

MIT License - Feel free to use and modify!
