# Quick Start Guide

## Installation

```bash
# Clone the repository
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro

# Install dependencies
npm install
```

## Configuration

1. Edit `config.json` to match your setup:
   - Set your Minecraft server host and port
   - Configure bot usernames and viewer ports
   - Adjust scheduler timezone and times
   - Configure capture settings

## Running the Application

### Start All Bots
```bash
npm start
```

### Access Bot Viewers
Open in your browser:
- http://localhost:3000 (Bot1)
- http://localhost:3001 (Bot2)
- http://localhost:3002 (Bot3)

### Check Status
```bash
curl http://localhost:8080/status
```

## Common Tasks

### Run Without Scheduler
Set `scheduler.enabled` to `false` in config.json

### Enable Twitch Integration
1. Set `twitch.enabled` to `true`
2. Add your channel, username, and OAuth token
3. Restart the application

### Change Capture Mode
Set `capture.mode` to either:
- `"local"` - Interactive browser-based
- `"headless"` - Automated background capture

### Add More Bots
Add to the `bots` array in config.json:
```json
{
  "username": "Bot4",
  "viewerPort": 3003,
  "enabled": true
}
```

## Twitch Commands

- `!status` - Bot connection status
- `!bots` - List active bots
- `!location` - Bot positions
- `!say <message>` - Make bots speak
- `!build` - Trigger building
- `!help` - Show commands

## Monitoring

### Status Endpoint
```bash
curl http://localhost:8080/status | jq
```

### Health Check
```bash
curl http://localhost:8080/health
```

### View Logs (systemd)
```bash
sudo journalctl -u minecraft-pipeline -f
```

## Examples

### Capture Screenshots
```bash
node examples/capture-example.js
```

### Test Twitch Integration
```bash
node examples/twitch-example.js
```

### Video Assembly
```bash
node examples/video-assembly-example.js
```

## Troubleshooting

### Bots Not Connecting
1. Check server is running: `nc -zv localhost 25565`
2. Verify config.json server settings
3. Check firewall rules

### Viewer Not Loading
1. Wait 30 seconds after bot spawn
2. Check port isn't in use: `lsof -i :3000`
3. Clear browser cache

### High Resource Usage
1. Reduce active bots
2. Lower capture resolution
3. Disable headless mode if not needed

## File Locations

- **Config**: `./config.json`
- **Logs**: Console output or systemd journal
- **Output**: `./output/` (screenshots, videos)
- **Examples**: `./examples/`

## Environment Variables

Optional environment variables:
```bash
export NODE_ENV=production
export TZ=America/New_York
```

## Production Deployment

```bash
# Copy service file
sudo cp example.service /etc/systemd/system/minecraft-pipeline.service

# Edit paths in service file
sudo nano /etc/systemd/system/minecraft-pipeline.service

# Enable and start
sudo systemctl enable minecraft-pipeline
sudo systemctl start minecraft-pipeline

# Check status
sudo systemctl status minecraft-pipeline
```

## Getting Help

1. Check README.md for detailed documentation
2. Review IMPLEMENTATION.md for technical details
3. Look at examples/ directory for code samples
4. Check existing GitHub issues

## Next Steps

1. Customize bot behaviors in `bots/ai-behaviors.js`
2. Add custom Twitch commands in `channels/twitch-chat.js`
3. Enhance video processing in `editor/assemble-video.js`
4. Implement actual TTS in `voices/tts.js`

---

For complete documentation, see [README.md](README.md)
