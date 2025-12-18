# Multi-Bot Minecraft Content Pipeline

A powerful Node.js application that enables multiple Mineflayer bots with automated capture, streaming, and content creation capabilities.

## Features

- **Multi-Bot Management**: Run multiple Minecraft bots simultaneously
- **Prismarine Viewer**: Each bot has its own web-based viewer
- **Capture Modes**: 
  - Local composite (browser-based studio)
  - Headless automated composite (Puppeteer + FFmpeg)
- **Scheduler**: Timezone-aware automated scheduling
- **Twitch Integration**: Interactive chat commands via tmi.js
- **Video Processing**: Automated video assembly and editing
- **AI Behaviors**: Bots can build structures, wander, and respond to chat
- **Monitoring**: HTTP endpoints for status and health checks

## Prerequisites

- Node.js 18.0.0 or higher
- Minecraft server (1.20.1 recommended)
- FFmpeg (installed via ffmpeg-static)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro
```

2. Install dependencies:
```bash
npm install
```

3. Configure the application by editing `config.json` (see Configuration section below)

## Configuration

Edit `config.json` to customize your setup:

### Server Configuration
```json
{
  "server": {
    "host": "localhost",
    "port": 25565,
    "version": "1.20.1"
  }
}
```

### Bot Configuration
```json
{
  "bots": [
    {
      "username": "Bot1",
      "viewerPort": 3000,
      "enabled": true
    }
  ]
}
```

### Scheduler Configuration
```json
{
  "scheduler": {
    "enabled": true,
    "timezone": "America/New_York",
    "schedule": [
      {
        "time": "14:00",
        "action": "start",
        "duration": 120
      }
    ]
  }
}
```

### Capture Configuration
```json
{
  "capture": {
    "mode": "local",
    "headless": false,
    "outputDir": "./output",
    "resolution": {
      "width": 1920,
      "height": 1080
    },
    "tiling": {
      "rows": 2,
      "cols": 2
    }
  }
}
```

### Twitch Integration
```json
{
  "twitch": {
    "enabled": false,
    "channel": "your_channel",
    "botUsername": "your_bot",
    "oauth": "oauth:your_token"
  }
}
```

## Usage

### Start the Application

```bash
npm start
```

Or for development:
```bash
npm run dev
```

### Viewer Access

Once bots are running, access their viewers at:
- Bot1: `http://localhost:3000`
- Bot2: `http://localhost:3001`
- Bot3: `http://localhost:3002`

### Monitoring Endpoints

- Status: `http://localhost:8080/status`
- Health: `http://localhost:8080/health`

### Twitch Commands

If Twitch integration is enabled:
- `!status` - Check bot connection status
- `!bots` - List all active bots
- `!location` - Get bot positions
- `!say <message>` - Make bots say something
- `!build` - Trigger building behavior
- `!help` - Show available commands

## File Structure

```
pro/
├── index.js                  # Main entry point
├── package.json              # Dependencies
├── config.json               # Configuration
├── monitoring.js             # HTTP monitoring server
├── example.service           # systemd service example
├── bots/
│   ├── bot-core.js          # Bot initialization and management
│   ├── ai-behaviors.js      # Bot AI behaviors (building, wandering)
│   └── everstream.js        # Continuous activity loop
├── viewer/
│   └── attach-viewer.js     # Prismarine viewer integration
├── capture/
│   ├── puppeteer-tiler.js   # Puppeteer-based tiling
│   └── ffmpeg-helpers.js    # FFmpeg video processing
├── channels/
│   └── twitch-chat.js       # Twitch chat integration
├── editor/
│   └── assemble-video.js    # Video post-processing
└── voices/
    └── tts.js               # Text-to-Speech (placeholder)
```

## Capture Modes

### Local Mode
Browser-based composite view with live tiling of all bot viewers.

### Headless Mode
Automated capture using Puppeteer to create MP4 recordings or stream via RTMP.

## Bot Behaviors

### Auto-Reconnect
Bots automatically reconnect if disconnected or kicked.

### 3x3 Hut Building
Bots can build simple 3x3 hut structures using available blocks.

### Wandering
Bots randomly explore within a configured range.

### Chat Responses
Bots respond to greetings and questions in game chat.

## Deployment

### Using systemd (Linux)

1. Copy the service file:
```bash
sudo cp example.service /etc/systemd/system/minecraft-pipeline.service
```

2. Edit the service file to match your paths:
```bash
sudo nano /etc/systemd/system/minecraft-pipeline.service
```

3. Enable and start the service:
```bash
sudo systemctl enable minecraft-pipeline
sudo systemctl start minecraft-pipeline
```

4. Check status:
```bash
sudo systemctl status minecraft-pipeline
```

5. View logs:
```bash
sudo journalctl -u minecraft-pipeline -f
```

## Development

### Adding New Behaviors

Edit `bots/ai-behaviors.js` to add custom bot behaviors:

```javascript
bot.customBehavior = function() {
  // Your custom behavior code
};
```

### Adding New Twitch Commands

Edit `channels/twitch-chat.js` in the `handleTwitchCommand` function:

```javascript
else if (lowerMessage === '!mycmd') {
  // Your command handler
}
```

## Troubleshooting

### Bots Won't Connect

- Verify server host and port in `config.json`
- Check if Minecraft server is running
- Ensure server allows offline mode (for testing)

### Viewer Not Loading

- Wait 30 seconds after bot spawn
- Check if port is already in use
- Verify firewall settings

### Capture Issues

- Ensure headless mode is enabled for server deployments
- Check FFmpeg installation: `node -e "console.log(require('ffmpeg-static'))"`
- Verify output directory permissions

### High CPU/Memory Usage

- Reduce number of active bots
- Adjust capture resolution and FPS
- Disable unused features (Twitch, TTS)

### Scheduler Not Triggering

- Verify timezone setting matches your location
- Check time format (HH:mm in 24-hour format)
- Ensure scheduler is enabled in config

## Performance Tips

1. **Reduce Viewer Resolution**: Lower resolution uses less resources
2. **Disable Headless Capture**: Only use when needed
3. **Limit Active Bots**: Start with 2-3 bots, add more as needed
4. **Use FFmpeg Presets**: "ultrafast" for live, "medium" for quality
5. **Monitor Resources**: Use monitoring endpoints to track performance

## Advanced Features

### RTMP Streaming

Enable RTMP streaming in config:
```json
{
  "capture": {
    "rtmp": {
      "enabled": true,
      "url": "rtmp://your-server/live/stream-key"
    }
  }
}
```

### Video Assembly

Use the editor module to assemble clips:
```javascript
const { assembleVideo } = require('./editor/assemble-video');
await assembleVideo([clip1, clip2, clip3], 'output.mp4');
```

## Dependencies

- **mineflayer**: Minecraft bot framework
- **prismarine-viewer**: Web-based Minecraft viewer
- **puppeteer**: Headless browser automation
- **ffmpeg-static**: FFmpeg binaries
- **fluent-ffmpeg**: FFmpeg Node.js wrapper
- **luxon**: Timezone-aware date/time handling
- **tmi.js**: Twitch chat integration

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section above
