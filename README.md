# AvatarOS - AI-Powered Minecraft Bot System

An advanced AI-powered Minecraft bot system with memory, learning capabilities, and dynamic plugin/mod support. Upload any plugin or mod and watch the AI bots automatically figure out how to use them!

## 🌟 Key Features

### 🤖 **AI Memory & Learning**
- **Short-term & Long-term Memory** - Bots remember experiences and learn from them
- **Automated Thinking** - AI decides actions based on past success rates
- **Behavior Learning** - Automatically improves strategies over time
- **Persistent Memory** - Learning survives across sessions

### 📤 **Dynamic Plugin/Mod System**
- **Upload Any Plugin/Mod** - Just drop files in `/plugins` or `/mods` folders
- **Auto-Discovery** - AI automatically finds and analyzes uploaded files
- **Self-Learning** - Bots figure out commands and features on their own
- **Memory Integration** - Remembers what works and what doesn't

### 🎮 **Core Features**
- **Unlimited AI Players** - Add as many AI-controlled Minecraft bots as you need
- **📺 Twitch Streaming** - Stream bot POV to Twitch without OBS
- **🎙️ 16 Realistic Voices** - 8 female and 8 male voice models for natural TTS
- **💬 Chat Interaction** - AI bots respond to Twitch chat and comment on gameplay
- **📅 Smart Scheduling** - Automatic streaming schedules prevent overlaps
- **🔄 Auto-Reconnect** - Bots automatically reconnect if disconnected
- **⚙️ In-Launcher Config Editor** - Interactive GUI to edit all settings

### 🔌 **Built-in Support**
- **Lifesteal SMP Plugin** - Heart-based PvP mechanics
- **Simple Voice Chat Mod** - Voice communication with private channels
- **And ANY plugin/mod you upload!**

## 🚀 Quick Start

### Building AvatarOS.exe

**The AvatarOS.exe is not included in the repository due to its size (426MB+). You must build it:**

```bash
# Install dependencies
npm install

# Build AvatarOS.exe for Windows
npm run build
```

The `AvatarOS.exe` will be created in the `dist/` directory.

**Alternative:** Download pre-built AvatarOS from the [Releases](../../releases) page when available.

### Running AvatarOS

**Option 1: Using the .exe launcher (Windows)**
1. Build AvatarOS with `npm run build` (see above)
2. Double-click `dist/AvatarOS.exe`
3. To open config editor: `AvatarOS.exe --config`

**Option 2: Run from source**
```bash
# Install dependencies
npm install

# Run AvatarOS
npm start

# Or open configuration editor
npm run config
# OR
npm start -- --config
```

## 📤 Uploading Plugins & Mods

### Upload Plugins
1. Place your `.jar` or `.js` plugin files in the `/plugins` directory
2. AvatarOS automatically discovers them on startup
3. AI bots analyze and learn how to use them
4. Knowledge is saved in memory for future use

### Upload Mods
1. Place your `.jar` or `.js` mod files in the `/mods` directory
2. AvatarOS automatically discovers them on startup
3. AI bots analyze and learn how to use them
4. Knowledge is saved in memory for future use

### Supported Formats
- **Plugins**: Bukkit, Spigot, Paper plugins (.jar)
- **Mods**: Forge, Fabric, Quilt mods (.jar)
- **Custom**: JavaScript implementations (.js)

## 🧠 AI Memory System

Each AI player has their own memory file that stores:

- **Short-term Memory**: Last 100 events
- **Long-term Memory**: Last 1000 important experiences
- **Learned Behaviors**: Actions and success rates
- **Plugin Knowledge**: Discovered plugins and how to use them
- **Mod Knowledge**: Discovered mods and how to use them
- **Player Interactions**: Relationship history

### How AI Learning Works

1. **Discover**: AI finds uploaded plugin/mod
2. **Analyze**: Extracts commands and features
3. **Experiment**: Tests discovered functionality
4. **Remember**: Stores results in memory
5. **Learn**: Adjusts behavior based on success
6. **Improve**: Higher success rate actions preferred

Memory files are stored in `/memory/<player_id>.json`

## ⚙️ In-Launcher Configuration Editor

Edit all settings inside AvatarOS with an interactive GUI!

```bash
# Open config editor
npm run config
# OR
npm start -- --config
# OR
AvatarOS.exe --config
```

**Features:**
- Interactive menu-driven interface
- Edit server settings, Twitch credentials, AI players
- Configure plugins and mods
- Add/remove AI players
- Save and apply changes instantly
- No need to manually edit JSON files

**Navigation:**
- ↑↓ - Navigate menu
- Enter - Select option
- Tab - Switch panels
- 'e' - Edit current section
- 'a' - Add new (on AI Players screen)
- 'd' - Delete (on AI Players screen)
- Ctrl+S - Save configuration
- Ctrl+C - Exit

## 📦 Build Commands

- `npm run build` - Build AvatarOS.exe for Windows
- `npm run build:all` - Build launchers for Windows, Linux, and macOS
- `npm start` - Run AvatarOS directly with Node.js
- `npm run config` - Open the interactive configuration editor

## 📝 License

MIT

---

## 🎯 What Makes AvatarOS Special?

### Traditional Minecraft Bots
- Need manual configuration for each plugin/mod
- Can't learn from experience
- Require code changes for new features
- No memory of past actions

### AvatarOS
- ✅ Upload any plugin/mod - AI figures it out
- ✅ Learns from every interaction
- ✅ Remembers what works
- ✅ Improves over time
- ✅ No code changes needed for new plugins/mods

**Upload a plugin → AI discovers it → AI learns it → AI uses it → AI remembers it**

That's the AvatarOS difference!

### Lifesteal SMP Plugin

When enabled, AI players participate in Lifesteal mechanics:
- Start with 10 hearts
- Gain 1 heart when killing another player (max 20)
- Lose 1 heart when dying (min 2)
- Get eliminated if hearts reach minimum

**Commands:**
- `!hearts` or `!hp` - Check current hearts

**Configuration:**
```json
{
  "plugins": {
    "enabled": true,
    "lifeStealSMP": {
      "enabled": true,
      "maxHearts": 20,
      "minHearts": 2
    }
  }
}
```

## 🎛️ Mods

### Simple Voice Chat Mod

AI players can use voice chat with realistic voice models!

**Features:**
- **Proximity Voice** - Bots speak using voice models when near players
- **Private Channels** - Create password-protected voice channels
- **Whisper Command** - Private voice messages to specific players
- **Voice Integration** - Uses configured voice models for TTS

**Commands:**
- `!voice` or `!vc` - Show voice chat info
- `!vmute` - Toggle voice mute
- `!vcreate <name> [password]` - Create private voice channel
- `!vjoin <name> [password]` - Join voice channel
- `!vleave` - Leave current voice channel
- `!vlist` - List available voice channels
- `/w <player> <message>` - Whisper to player with voice

**Configuration:**
```json
{
  "mods": {
    "enabled": true,
    "simpleVoiceChat": {
      "enabled": true,
      "port": 24454,
      "voiceDistance": 48,
      "useVoiceModel": true,
      "allowPrivateChat": true
    }
  }
}
```

**Voice Distance:** Bots can hear and respond to players within 48 blocks by default.

## ⚙️ Configuration

Edit `config/config.json` to customize your setup:

```json
{
  "server": "localhost",
  "port": 25565,
  "version": "1.20.1",
  "twitch": {
    "enabled": true,
    "channelName": "minecraft_ai_collab",
    "oauth": "oauth:your_twitch_oauth_token",
    "clientId": "your_twitch_client_id"
  },
  "aiPlayers": [
    {
      "id": "player1",
      "username": "AIPlayer1",
      "voiceModel": "female_2_energetic",
      "personality": "friendly",
      "streamingSchedule": {
        "enabled": true,
        "days": ["Monday", "Wednesday", "Friday"],
        "startTime": "14:00",
        "duration": 120
      }
    }
  ],
  "features": {
    "chatInteraction": true,
    "gameCommentary": true,
    "voiceEnabled": true
  }
}
```

### Adding Unlimited AI Players

Simply add more player objects to the `aiPlayers` array:

```json
{
  "id": "player2",
  "username": "AIPlayer2",
  "voiceModel": "male_3_energetic",
  "personality": "adventurous",
  "streamingSchedule": {
    "enabled": true,
    "days": ["Tuesday", "Thursday", "Saturday"],
    "startTime": "14:00",
    "duration": 120
  }
}
```

### Available Voice Models

**Female Voices:**
- `female_1_soft` - Soft and gentle
- `female_2_energetic` - Upbeat and lively
- `female_3_calm` - Relaxed and soothing
- `female_4_cheerful` - Happy and bright
- `female_5_professional` - Clear and articulate
- `female_6_warm` - Friendly and inviting
- `female_7_playful` - Fun and spirited
- `female_8_confident` - Strong and assured

**Male Voices:**
- `male_1_deep` - Deep and resonant
- `male_2_friendly` - Approachable and kind
- `male_3_energetic` - Dynamic and enthusiastic
- `male_4_calm` - Steady and composed
- `male_5_professional` - Polished and clear
- `male_6_warm` - Welcoming and genuine
- `male_7_enthusiastic` - Excited and passionate
- `male_8_confident` - Authoritative and sure

### Streaming Schedules

The scheduler automatically prevents overlaps. Configure each bot's schedule:

- **days**: Array of days (e.g., `["Monday", "Wednesday"]`)
- **startTime**: 24-hour format (e.g., `"14:00"`)
- **duration**: Minutes to stream (e.g., `120` for 2 hours)

The system ensures only one AI player streams at a time on the shared Twitch channel.

## 🎮 How It Works

1. **AI Players**: Each bot uses Mineflayer to play Minecraft autonomously
2. **Streaming**: When scheduled, the bot's POV is streamed to Twitch
3. **Voice System**: Text-to-speech with personality-specific voices
4. **Chat Interaction**: Bots read and respond to Twitch chat messages
5. **Game Commentary**: Bots comment on gameplay events (mining, building, deaths, etc.)
6. **Schedule Management**: Automatic switching between streaming bots

## 📦 Build Commands

- `npm run build` - Build Windows .exe launcher
- `npm run build:all` - Build launchers for Windows, Linux, and macOS
- `npm start` - Run the application directly with Node.js

## 🔧 Twitch Setup

1. Create a Twitch account for your AI collab channel
2. Get OAuth token from [Twitch Token Generator](https://twitchapps.com/tmi/)
3. Get Client ID from [Twitch Developer Console](https://dev.twitch.com/console)
4. Add credentials to `config/config.json`
5. Enable streaming in config: `"streamingEnabled": true`

## 📋 Requirements

- Node.js 16 or higher
- Minecraft server (any version 1.8+)
- Twitch account (for streaming features)
- Platform-specific TTS engine:
  - Windows: SAPI (built-in)
  - macOS: say (built-in)
  - Linux: espeak or festival

## 🎯 Advanced Features

### Custom Commands

Twitch viewers can use these commands:
- `!bots` - List active AI players
- `!schedule` - Show streaming schedule
- `!voice` - Info about voice system
- `!help` - Show available commands

### Bot Personalities

Each bot can have a unique personality that affects:
- Chat response style
- Commentary tone
- Gameplay behavior

### Auto-Reconnect

Bots automatically reconnect if:
- Server restarts
- Network issues occur
- Bot is kicked from server

## 📝 License

MIT
