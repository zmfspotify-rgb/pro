# Quick Start Guide

Get your Minecraft bot launcher up and running in minutes!

## 1. Backend Setup (5 minutes)

```bash
# Clone and install
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro
npm install

# Configure
cp config/config.example.json config/config.json
cp config/schedules.example.json config/schedules.json

# Edit config/config.json with your details:
# - Minecraft server IP and port
# - Twitch channel name and credentials
# - Bot names

# Start the backend
npm start
```

Backend will be running on `http://localhost:3000`

## 2. iOS App Setup (5 minutes)

```bash
# Navigate to iOS app
cd ios-app
npm install

# Start Expo
npm start
```

Then:
- Press `i` to open iOS simulator, OR
- Scan QR code with Expo Go app on your iPhone

## 3. Configure the App

In the app:
1. Tap **Settings** (⚙️)
2. Enter your backend server URL (e.g., `http://YOUR_IP:3000`)
3. Configure settings (they'll sync to backend)
4. Tap **Save Configuration**

## 4. Add Bots

In Settings:
1. Enter a bot ID (e.g., "miner_bot")
2. Tap **Add**
3. Repeat for each bot
4. Save configuration

## 5. Create Streaming Schedule

1. Go to **📅 Manage Schedules**
2. Tap **➕ Add Schedule**
3. Select a bot
4. Add stream time using cron expression:
   - Daily at 2 PM: `0 14 * * *`
   - Duration: `120` (minutes)
5. Tap **Add Time Slot**
6. Tap **Save**

## 6. Launch Your Bots!

From the home screen:
1. Tap on a bot
2. Tap **▶️ Start Bot**
3. Wait for connection
4. Tap **📹 Start Streaming** (if needed)

## Common Configurations

### Home Server Setup

If running backend on your home computer:

```bash
# Find your IP address
# Mac/Linux:
ifconfig | grep "inet "
# Windows:
ipconfig

# Use in app: http://192.168.1.XXX:3000
```

### Cloud Backend Setup

Deploy to Heroku, Railway, or similar:

```bash
# Example with Railway
npm install -g railway
railway login
railway init
railway up

# Get your URL from Railway dashboard
# Use in app: https://your-app.railway.app
```

### Twitch OAuth Token

Get your token:
1. Visit: https://twitchapps.com/tmi/
2. Click "Connect"
3. Authorize
4. Copy the oauth token
5. Add to `config/config.json`

## Bot Capabilities

Your bots can:

### Simple Tasks
- Mine blocks
- Collect items
- Follow players
- Respond to chat

### Complex Tasks
- Build structures
- Farm crops
- Hunt mobs
- Explore terrain
- Craft items

### Streaming Features
- Live gameplay to Twitch
- AI chat responses
- Text-to-speech voices
- Scheduled streaming

## Example Schedule

Edit `config/schedules.json`:

```json
{
  "miner_bot": {
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

This bot will:
- Stream every day at 2 PM for 2 hours
- Mine diamonds every day at 10 AM (non-streaming)

## Cron Schedule Examples

```
0 14 * * *      # Every day at 2:00 PM
0 */2 * * *     # Every 2 hours
30 9 * * 1-5    # 9:30 AM, Monday to Friday
0 20 * * 6,0    # 8:00 PM on weekends
*/15 * * * *    # Every 15 minutes
```

## Voice Models

Available options in config:
- `default` - System default
- `male1` - Male voice 1
- `male2` - Male voice 2
- `female1` - Female voice 1
- `female2` - Female voice 2
- `robot` - Robotic voice

## Remote Access

### Same Network
Use your computer's local IP: `http://192.168.1.XXX:3000`

### From Anywhere (ngrok)
```bash
npm install -g ngrok
ngrok http 3000

# Use the https URL in your app
```

### Permanent Solution
Deploy backend to cloud hosting (see DEPLOYMENT.md)

## Testing the Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:3000/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **List Bots**
   ```bash
   curl http://localhost:3000/api/bots
   ```

3. **In the App**
   - Connection indicator should be green
   - Bots should appear in list
   - Tap a bot to see status

## Troubleshooting

### Bot Won't Start
- Check Minecraft server is online
- Verify server IP and port in config
- Check bot username is available

### Can't Connect from App
- Ensure backend is running
- Verify server URL in app settings
- Check firewall isn't blocking port 3000

### Streaming Doesn't Work
- Verify Twitch credentials in config
- Check stream key is correct
- Ensure bot is running before streaming

### Schedule Not Working
- Check cron expression syntax
- Verify bot ID matches
- Check backend logs for errors

## Next Steps

- Read [README.md](../README.md) for detailed documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for iOS deployment
- Customize bot behavior in backend code
- Create custom tasks in `ai-task-executor.js`
- Add custom chat responses in `twitch-chat-responder.js`

## Need Help?

- Check logs: `npm start` shows all activity
- Review configuration files
- Ensure all dependencies are installed
- Verify network connectivity

Happy botting! 🤖
