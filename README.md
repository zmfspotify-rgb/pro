# Minecraft Bot Launcher - iOS App & Backend System

A comprehensive multi-bot Minecraft content pipeline project powered by Node.js with iOS mobile launcher app.

## Features

### 🤖 AI Bot Capabilities
- **Intelligent Minecraft Gameplay**: Bots can perform both simple and complex tasks in Minecraft
  - Mining, building, exploring, farming, hunting
  - Pathfinding and navigation
  - Resource collection and crafting
  - Autonomous decision-making

- **Twitch Streaming Integration**
  - Stream gameplay to Twitch with configurable schedules
  - Real-time chat interaction
  - AI-powered chat responses
  - Custom voice models for text-to-speech

- **Scheduling System**
  - Automated streaming schedules using cron expressions
  - Separate schedules for streaming and non-streaming activities
  - Flexible time slot management
  - Remote schedule editing from iOS app

### 📱 iOS Mobile App
- **Remote Bot Management**
  - Start/stop bots from anywhere with internet connection
  - Real-time bot status monitoring
  - Control streaming on/off
  - View current bot activities

- **Configuration Management**
  - Edit Minecraft server settings
  - Configure Twitch credentials
  - Manage voice/TTS settings
  - Add/remove bots

- **Schedule Management**
  - Create and edit streaming schedules
  - Set automated activity times
  - Visual schedule overview
  - Easy-to-use cron expression interface

## Project Structure

```
pro/
├── backend/                    # Node.js backend server
│   ├── server.js              # Express API server
│   ├── bot-manager.js         # Bot lifecycle management
│   ├── minecraft-bot.js       # Minecraft bot implementation
│   ├── ai-task-executor.js    # AI task execution engine
│   ├── twitch-streamer.js     # Twitch streaming integration
│   ├── twitch-chat-responder.js # AI chat response system
│   ├── schedule-manager.js    # Cron-based scheduling
│   └── config-manager.js      # Configuration management
├── ios-app/                   # React Native iOS application
│   ├── App.js                 # Main app component
│   ├── src/
│   │   ├── screens/          # App screens
│   │   │   ├── HomeScreen.js         # Bot list and overview
│   │   │   ├── BotControlScreen.js   # Individual bot control
│   │   │   ├── SettingsScreen.js     # Configuration editor
│   │   │   └── ScheduleScreen.js     # Schedule management
│   │   └── services/
│   │       └── ApiService.js  # Backend API client
│   └── package.json
├── config/                    # Configuration files
│   ├── config.json           # Main configuration
│   ├── schedules.json        # Bot schedules
│   └── README.md             # Config documentation
└── package.json              # Backend dependencies

```

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro
```

2. Install dependencies:
```bash
npm install
```

3. Configure the system:
   - Edit `config/config.json` with your Minecraft server details
   - Add your Twitch credentials
   - Configure bot IDs and settings

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### iOS App Setup

1. Navigate to the iOS app directory:
```bash
cd ios-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS simulator or device:
```bash
npm run ios
```

### Building IPA for Distribution

To build an IPA file for distribution:

1. Install Expo CLI globally:
```bash
npm install -g expo-cli eas-cli
```

2. Configure EAS Build:
```bash
cd ios-app
eas build:configure
```

3. Build for iOS:
```bash
eas build --platform ios
```

4. The IPA file will be available for download from your Expo dashboard.

## Configuration

### Minecraft Server Settings

Edit `config/config.json`:

```json
{
  "minecraft": {
    "host": "your-server.com",
    "port": 25565,
    "version": "1.19",
    "auth": "offline"
  }
}
```

### Twitch Integration

Add your Twitch credentials to `config/config.json`:

```json
{
  "twitch": {
    "channel": "your_channel_name",
    "streamKey": "live_xxxxx",
    "oauth": "oauth:your_token_here"
  }
}
```

Get your Twitch OAuth token from: https://twitchapps.com/tmi/

### Voice Configuration

Configure text-to-speech settings:

```json
{
  "voice": {
    "enabled": true,
    "model": "default"
  }
}
```

Available models: `default`, `male1`, `male2`, `female1`, `female2`, `robot`

### Bot Schedules

Edit `config/schedules.json` to set up streaming schedules:

```json
{
  "bot1": {
    "streaming": [
      {
        "cronExpression": "0 14 * * *",
        "duration": 120
      }
    ],
    "activities": [
      {
        "cronExpression": "0 10 * * *",
        "task": {
          "type": "mine",
          "blockType": "diamond_ore",
          "count": 10
        }
      }
    ]
  }
}
```

## API Endpoints

### Bot Management
- `GET /api/bots` - List all bots
- `POST /api/bots/start` - Start a bot
- `POST /api/bots/stop` - Stop a bot
- `GET /api/bots/:botId/status` - Get bot status

### Streaming
- `POST /api/bots/:botId/stream/start` - Start streaming
- `POST /api/bots/:botId/stream/stop` - Stop streaming

### Configuration
- `GET /api/config` - Get configuration
- `POST /api/config` - Update configuration

### Scheduling
- `GET /api/schedule` - Get all schedules
- `POST /api/schedule` - Update bot schedule
- `DELETE /api/schedule/:botId` - Delete bot schedule

## AI Bot Tasks

The bots can perform various tasks:

- **mine**: Mine specific blocks
- **build**: Construct structures
- **explore**: Explore the world
- **collect**: Collect items
- **hunt**: Hunt specific mobs
- **farm**: Farm crops
- **heal**: Eat food to heal
- **craft**: Craft items
- **follow**: Follow a player

Example task:
```json
{
  "type": "mine",
  "blockType": "diamond_ore",
  "count": 10
}
```

## Chat Interaction

Bots automatically respond to:
- Greetings (hi, hello, hey)
- Questions (what are you doing, how are you)
- Compliments (nice, cool, awesome)
- Farewells (bye, goodbye)
- Bot mentions

Chat responses are AI-generated and context-aware to create natural interactions.

## Streaming Features

- **Automated Schedule**: Bots stream according to configured schedules
- **Voice Interaction**: Text-to-speech for chat responses
- **Gameplay Streaming**: Live gameplay footage to Twitch
- **Chat Integration**: Real-time interaction with viewers
- **Collab Channel**: Multiple bots can stream to the same channel

## Security Notes

- Keep your Twitch stream key and OAuth token private
- Use environment variables for sensitive data in production
- The iOS app requires network access to connect to the backend
- Ensure your backend server is properly secured with HTTPS in production

## Troubleshooting

### Bot won't connect to Minecraft server
- Verify server address and port in config
- Check if server is online
- Ensure version matches server version

### Streaming not working
- Verify Twitch credentials
- Check stream key is correct
- Ensure FFmpeg is installed on your system

### iOS app can't connect
- Verify backend server is running
- Check server URL in app settings
- Ensure both devices are on the same network (for local testing)

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

ISC
