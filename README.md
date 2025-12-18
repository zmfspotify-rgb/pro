# Minecraft AI Bot Pipeline with Twitch Streaming

A multi-bot Minecraft content pipeline project powered by Node.js featuring AI players that can stream to Twitch with realistic voices, chat interaction, plugin/mod support, and an in-launcher configuration editor.

## 🌟 Features

- **🤖 Unlimited AI Players** - Add as many AI-controlled Minecraft bots as you need
- **📺 Twitch Streaming** - Stream bot POV to Twitch without OBS
- **🎙️ Realistic Voices** - 16 voice models (8 female, 8 male) for natural TTS
- **💬 Chat Interaction** - AI bots respond to Twitch chat and comment on gameplay
- **📅 Smart Scheduling** - Automatic streaming schedules prevent overlaps
- **🎮 Mineflayer Integration** - Advanced bot AI with pathfinding and game awareness
- **🔄 Auto-Reconnect** - Bots automatically reconnect if disconnected
- **⚙️ In-Launcher Config Editor** - Interactive GUI to edit settings without touching config files
- **🔌 Plugin Support** - Lifesteal SMP plugin with heart tracking
- **🎛️ Mod Support** - Simple Voice Chat mod with private channels, passwords, and whisper commands

## 🚀 Quick Start

### Building the .exe Launcher (Required)

**The launcher.exe is not included in the repository due to its size (426MB). You must build it:**

```bash
# Install dependencies
npm install

# Build the .exe launcher for Windows
npm run build
```

The `launcher.exe` will be created in the `dist/` directory.

**Alternative:** Download pre-built launcher from the [Releases](../../releases) page when available.

### Running the Application

**Option 1: Using the .exe launcher (Windows)**
1. Build the launcher with `npm run build` (see above)
2. Double-click `dist/launcher.exe`
3. To open config editor: `launcher.exe --config`

**Option 2: Run from source**
```bash
# Install dependencies
npm install

# Run the application
npm start

# Or open configuration editor
npm run config
# OR
npm start -- --config
```

## ⚙️ In-Launcher Configuration Editor

Edit all settings inside the launcher with an interactive GUI!

```bash
# Open config editor
npm run config
# OR
npm start -- --config
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

- `npm run build` - Build Windows .exe launcher
- `npm run build:all` - Build launchers for Windows, Linux, and macOS
- `npm start` - Run the application directly with Node.js
- `npm run config` - Open the interactive configuration editor

## 🔌 Plugins

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
