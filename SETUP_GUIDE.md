# Complete Setup Guide - Minecraft AI Bot Pipeline

## Table of Contents
1. [Quick Setup](#quick-setup)
2. [Detailed Configuration](#detailed-configuration)
3. [Twitch Streaming Setup](#twitch-streaming-setup)
4. [Adding AI Players](#adding-ai-players)
5. [Voice Models](#voice-models)
6. [Streaming Schedules](#streaming-schedules)
7. [Troubleshooting](#troubleshooting)

## Quick Setup

### Step 1: Download
- Download `launcher.exe` from the `dist/` folder
- Download `config/config.json` template

### Step 2: Configure
Edit `config.json` with your settings:
```json
{
  "server": "your.minecraft.server.com",
  "port": 25565,
  "version": "1.20.1"
}
```

### Step 3: Run
Double-click `launcher.exe`

## Detailed Configuration

### Minecraft Server Settings
```json
{
  "server": "localhost",        // Minecraft server address
  "port": 25565,                // Server port
  "version": "1.20.1",          // Minecraft version
  "autoReconnect": true,        // Auto-reconnect on disconnect
  "reconnectDelay": 5000        // Delay before reconnect (ms)
}
```

### Feature Toggles
```json
{
  "features": {
    "autoMine": false,          // Enable auto-mining
    "autoFarm": false,          // Enable auto-farming
    "pathfinding": true,        // Enable pathfinding
    "chatInteraction": true,    // Respond to chat
    "gameCommentary": true,     // Comment on gameplay
    "voiceEnabled": true        // Enable TTS voices
  }
}
```

## Twitch Streaming Setup

### Step 1: Get Twitch Credentials

1. **Create a Twitch Account**
   - Go to [Twitch.tv](https://twitch.tv) and create an account
   - This will be your AI collab channel

2. **Get OAuth Token**
   - Visit [Twitch Token Generator](https://twitchapps.com/tmi/)
   - Click "Connect"
   - Copy the OAuth token (starts with `oauth:`)

3. **Get Client ID**
   - Go to [Twitch Developer Console](https://dev.twitch.com/console)
   - Register a new application
   - Copy the Client ID

### Step 2: Configure Twitch
```json
{
  "twitch": {
    "enabled": true,
    "channelName": "your_channel_name",
    "oauth": "oauth:your_token_here",
    "clientId": "your_client_id_here",
    "streamingEnabled": true
  }
}
```

### Step 3: Test
Run the launcher and check for: `[TwitchChat] Connected to channel: your_channel_name`

## Adding AI Players

### Unlimited Players
Add as many AI players as you want to the `aiPlayers` array:

```json
{
  "aiPlayers": [
    {
      "id": "player1",               // Unique ID
      "username": "MinerMike",       // In-game name
      "voiceModel": "male_1_deep",   // Voice to use
      "personality": "friendly",     // Personality type
      "streamingSchedule": {
        "enabled": true,
        "days": ["Monday", "Wednesday", "Friday"],
        "startTime": "14:00",        // 2:00 PM
        "duration": 120              // 2 hours
      }
    },
    {
      "id": "player2",
      "username": "BuilderBella",
      "voiceModel": "female_2_energetic",
      "personality": "creative",
      "streamingSchedule": {
        "enabled": true,
        "days": ["Tuesday", "Thursday", "Saturday"],
        "startTime": "16:00",        // 4:00 PM
        "duration": 180              // 3 hours
      }
    }
  ]
}
```

### Personality Types
- **friendly** - Welcoming and social
- **adventurous** - Exploration-focused
- **creative** - Building-focused
- **competitive** - Achievement-oriented
- **educational** - Teaching-focused

## Voice Models

### Female Voices (8 Models)
1. **female_1_soft** - Gentle, soothing tone
2. **female_2_energetic** - Upbeat, lively
3. **female_3_calm** - Relaxed, peaceful
4. **female_4_cheerful** - Happy, bright
5. **female_5_professional** - Clear, articulate
6. **female_6_warm** - Friendly, inviting
7. **female_7_playful** - Fun, spirited
8. **female_8_confident** - Strong, assured

### Male Voices (8 Models)
1. **male_1_deep** - Deep, resonant
2. **male_2_friendly** - Approachable, kind
3. **male_3_energetic** - Dynamic, enthusiastic
4. **male_4_calm** - Steady, composed
5. **male_5_professional** - Polished, clear
6. **male_6_warm** - Welcoming, genuine
7. **male_7_enthusiastic** - Excited, passionate
8. **male_8_confident** - Authoritative, sure

### Voice Selection Tips
- Match voice to personality
- Mix different voices for variety
- Test voices before streaming

## Streaming Schedules

### Schedule Configuration
```json
{
  "streamingSchedule": {
    "enabled": true,
    "days": ["Monday", "Wednesday", "Friday"],
    "startTime": "14:00",     // 24-hour format
    "duration": 120           // Minutes
  }
}
```

### Preventing Overlaps
The system automatically prevents overlaps:
- Only ONE bot streams at a time
- Schedules are checked every minute
- Conflicts are logged on startup

### Best Practices
1. **Stagger schedules** - Different days for each bot
2. **Different times** - Even on same days
3. **Buffer time** - Add 10-15 min between streams
4. **Test schedules** - Run launcher to check for conflicts

### Example Schedule (No Overlaps)
```json
{
  "aiPlayers": [
    {
      "id": "morning_bot",
      "streamingSchedule": {
        "days": ["Monday", "Wednesday", "Friday"],
        "startTime": "09:00",
        "duration": 180
      }
    },
    {
      "id": "afternoon_bot",
      "streamingSchedule": {
        "days": ["Monday", "Wednesday", "Friday"],
        "startTime": "14:00",
        "duration": 180
      }
    },
    {
      "id": "evening_bot",
      "streamingSchedule": {
        "days": ["Tuesday", "Thursday", "Saturday"],
        "startTime": "18:00",
        "duration": 180
      }
    }
  ]
}
```

## Troubleshooting

### Bot Can't Connect to Server
- Check server address and port
- Verify server is online
- Check Minecraft version matches
- Ensure server allows offline mode (for AI bots)

### Twitch Chat Not Working
- Verify OAuth token is correct
- Check channel name spelling
- Ensure Twitch account is verified
- Test token at [Twitch Token Generator](https://twitchapps.com/tmi/)

### Voice Not Working
**Windows:**
- Voices use Windows SAPI (built-in)
- No additional setup needed

**macOS:**
- Voices use `say` command (built-in)
- Test with: `say "Hello"`

**Linux:**
- Install espeak: `sudo apt-get install espeak`
- Or festival: `sudo apt-get install festival`

### Schedule Conflicts
If you see: `[WARN] Schedule conflicts detected`
1. Check the conflict message
2. Adjust start times or days
3. Ensure only one bot per time slot
4. Restart launcher to verify

### Bot Keeps Disconnecting
- Check `autoReconnect` is `true`
- Increase `reconnectDelay` if network is slow
- Verify server isn't kicking bots
- Check server whitelist/permissions

## Advanced Tips

### Multiple Servers
Run separate launcher instances for different servers:
```bash
launcher.exe --config server1.json
launcher.exe --config server2.json
```

### Custom Commands
Viewers can use these Twitch commands:
- `!bots` - List active AI players
- `!schedule` - Show streaming times
- `!voice` - Info about voices
- `!help` - Show all commands

### Performance Optimization
- Limit AI players to 5-10 per server
- Disable features you don't use
- Reduce streaming duration for testing
- Use faster reconnect delays (3000-5000ms)

## Support

For issues or questions:
1. Check this guide first
2. Verify your config.json syntax
3. Check console output for errors
4. Test with minimal config (1-2 bots)

## Example Configs

### Minimal Setup (No Streaming)
```json
{
  "server": "localhost",
  "port": 25565,
  "version": "1.20.1",
  "twitch": { "enabled": false },
  "aiPlayers": [
    {
      "id": "player1",
      "username": "TestBot",
      "voiceModel": "male_1_deep",
      "streamingSchedule": { "enabled": false }
    }
  ],
  "features": {
    "chatInteraction": false,
    "gameCommentary": false,
    "voiceEnabled": false
  }
}
```

### Full Featured Setup
See the default `config/config.json` for a complete example with all features enabled.
