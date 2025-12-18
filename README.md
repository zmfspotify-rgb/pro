# Minecraft AI Bot Pipeline with Twitch Streaming

A multi-bot Minecraft content pipeline project powered by Node.js featuring AI players that can stream to Twitch with realistic voices and chat interaction.

## 🌟 Features

- **🤖 Unlimited AI Players** - Add as many AI-controlled Minecraft bots as you need
- **📺 Twitch Streaming** - Stream bot POV to Twitch without OBS
- **🎙️ Realistic Voices** - 16 voice models (8 female, 8 male) for natural TTS
- **💬 Chat Interaction** - AI bots respond to Twitch chat and comment on gameplay
- **📅 Smart Scheduling** - Automatic streaming schedules prevent overlaps
- **🎮 Mineflayer Integration** - Advanced bot AI with pathfinding and game awareness
- **🔄 Auto-Reconnect** - Bots automatically reconnect if disconnected

## 🚀 Quick Start

### Using the .exe Launcher (Windows)

**Option 1: Download from repository**
1. Download `launcher.exe` from the `dist/` folder in this repository
2. Download and edit `config/config.json` to configure your bots
3. Double-click `launcher.exe` to start the bot pipeline

**Option 2: Download from releases**
1. Download the latest `launcher.exe` from the [Releases](../../releases) page
2. Configure `config/config.json` (see configuration section below)
3. Double-click `launcher.exe` to start the bot pipeline

### Running from Source

```bash
# Install dependencies
npm install

# Run the application
npm start
```

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
