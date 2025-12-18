# User Guide - Minecraft Bot Manager Pro

## Table of Contents
1. [Getting Started](#getting-started)
2. [Adding Your First Bot](#adding-your-first-bot)
3. [Understanding Bot Modes](#understanding-bot-modes)
4. [Creating Schedules](#creating-schedules)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

1. Double-click `Minecraft Bot Manager Pro.exe` (or the installer)
2. The application will open to the Dashboard view
3. You'll see statistics showing 0 bots (we'll add some!)

### Interface Overview

The application has 5 main sections accessible from the left sidebar:

- **📊 Dashboard**: Overview of all your bots
- **🤖 Bots**: Manage individual bots
- **📅 Schedule**: Set up streaming schedules
- **📝 Logs**: View bot activity logs
- **⚙️ Settings**: Configure application settings

## Adding Your First Bot

### Step-by-Step

1. **Navigate to Bots Section**
   - Click the "🤖 Bots" option in the left sidebar

2. **Click "+ Add Bot"**
   - A modal window will appear

3. **Fill in Bot Details**:

   **Bot Name** (Required)
   - Give your bot a friendly name
   - Example: "StreamBot1", "LobbyBot", "AFK Bot"

   **Username** (Required)
   - The Minecraft username for this bot
   - For offline mode: Any username works
   - For online mode: Must be a valid Minecraft account username

   **Password** (Optional)
   - Leave EMPTY for offline mode (no authentication)
   - Enter your Microsoft account password for online mode

   **Server Address** (Required)
   - The Minecraft server IP or domain
   - Examples: "play.hypixel.net", "mc.example.com", "192.168.1.100"

   **Port** (Default: 25565)
   - Usually leave as default
   - Change only if the server uses a different port

   **Always On** (Checkbox)
   - ✅ Checked: Bot stays online 24/7
   - ⬜ Unchecked: Bot follows schedule only

   **Auto Reconnect** (Checkbox - Recommended: ON)
   - ✅ Checked: Bot auto-reconnects if disconnected
   - ⬜ Unchecked: Bot stays offline after disconnect

4. **Click "Save Bot"**

### Example Configurations

#### Example 1: Streaming Bot (Scheduled)
```
Name: StreamBot1
Username: MyStreamerBot
Password: [leave empty for offline]
Server: play.myserver.com
Port: 25565
Always On: ⬜ (OFF)
Auto Reconnect: ✅ (ON)
```
*This bot will only connect during scheduled times*

#### Example 2: Always-On Lobby Bot
```
Name: LobbyBot24/7
Username: LobbyHelper
Password: [leave empty for offline]
Server: play.myserver.com
Port: 25565
Always On: ✅ (ON)
Auto Reconnect: ✅ (ON)
```
*This bot stays connected 24/7, ignoring schedules*

#### Example 3: Authenticated Bot
```
Name: PremiumBot
Username: MyRealMinecraftUsername
Password: MyMicrosoftPassword123
Server: play.hypixel.net
Port: 25565
Always On: ⬜ (OFF)
Auto Reconnect: ✅ (ON)
```
*This bot uses Microsoft authentication*

## Understanding Bot Modes

### 🟢 Always On Mode

**When to use:**
- Lobby presence bots
- AFK farming bots
- 24/7 server presence
- Background bots that aren't streaming

**How it works:**
- Bot connects immediately when you start it
- Stays connected regardless of schedule
- Auto-reconnects if connection drops (if enabled)
- Perfect for bots that play but don't stream

**Important:** This is the KEY FEATURE for "bots who aren't streaming can still log on the server and play even when they aren't on the streaming schedule"

### 📅 Scheduled Mode (Always On = OFF)

**When to use:**
- Streaming bots
- Bots that should only be active at certain times
- Saving server resources

**How it works:**
- Bot only connects during scheduled time slots
- Automatically starts at schedule start time
- Automatically stops at schedule end time
- Requires a schedule to be created

### 🔄 Auto Reconnect

**When enabled:**
- Bot automatically reconnects if kicked
- Bot reconnects after network issues
- Respects "Always On" and schedule settings

**When disabled:**
- Bot stays offline after any disconnect
- Must be manually restarted

## Creating Schedules

### Why Use Schedules?

Schedules are perfect for:
- Streaming bots (stream Mon-Fri 9am-5pm)
- Limited resource servers
- Rotating bot presence
- Time-based automation

### Creating a Schedule

1. **Navigate to Schedule Section**
   - Click "📅 Schedule" in the sidebar

2. **Click "+ Add Schedule"**

3. **Configure Schedule**:

   **Select Bot**
   - Choose which bot this schedule applies to
   - Note: Bots with "Always On" will ignore this schedule

   **Days**
   - Check the days this schedule should be active
   - You can select multiple days
   - Example: Mon-Fri for weekday streaming

   **Start Time**
   - When the bot should connect
   - Example: 09:00 for 9 AM

   **End Time**
   - When the bot should disconnect
   - Example: 17:00 for 5 PM

4. **Click "Save Schedule"**

### Example Schedules

#### Weekday Stream Schedule
```
Bot: StreamBot1
Days: ✅ Mon, ✅ Tue, ✅ Wed, ✅ Thu, ✅ Fri
Start: 14:00 (2 PM)
End: 20:00 (8 PM)
```

#### Weekend Gaming Schedule
```
Bot: WeekendBot
Days: ✅ Sat, ✅ Sun
Start: 10:00 (10 AM)
End: 23:00 (11 PM)
```

#### 24/7 Alternative (using schedule)
```
Bot: AlwaysOnBot
Days: ✅ All 7 days
Start: 00:00
End: 23:59
```

### Multiple Schedules

You can create multiple schedules for the same bot:
- Example: Different hours on weekdays vs weekends
- The bot will be active during ANY matching schedule

## Advanced Features

### Managing Bots

**Starting a Bot**
- Click the "▶️ Start" button on any offline bot
- Bot will connect immediately (if Always On) or wait for schedule

**Stopping a Bot**
- Click the "⏹️ Stop" button on any online bot
- Bot will disconnect immediately

**Toggling Always On**
- Click the "✏️" edit button
- This toggles the Always On mode
- Changes take effect immediately

**Removing a Bot**
- Click the "🗑️" delete button
- Confirm the deletion
- Bot will be stopped and removed

### Viewing Logs

1. **Navigate to Logs Section**
2. **Filter by Bot** (optional)
   - Use the dropdown to view specific bot logs
   - Select "All Bots" to see everything
3. **Clear Logs**
   - Click "Clear" to reset the log display

**Log Levels:**
- 🔵 Info: Normal operations (login, spawn, etc.)
- 🟡 Warning: Non-critical issues (disconnect, etc.)
- 🔴 Error: Critical problems (kick, auth failure, etc.)

### Dashboard

The dashboard shows:
- **Total Bots**: How many bots you've configured
- **Online**: Currently connected bots
- **Offline**: Bots not currently connected
- **Scheduled**: Number of schedules created

Plus a list of currently active bots.

## Troubleshooting

### Bot Won't Connect

**Check 1: Server Address**
- Verify the server is online
- Test the address in Minecraft client first
- Make sure port is correct (usually 25565)

**Check 2: Authentication**
- Offline mode: Password should be EMPTY
- Online mode: Check password is correct
- Online mode: Server must allow online-mode clients

**Check 3: Server Allows Bots**
- Some servers block bots
- Some servers have player limits
- Some servers require whitelist

### Bot Connects Then Immediately Disconnects

**Possible Causes:**
- Server kicked the bot (check logs for reason)
- Bot was banned/not whitelisted
- Server has anti-bot protection
- Internet connection issue

**Solution:**
- Check the Logs section for kick reason
- Disable Auto Reconnect if repeatedly kicked
- Contact server admin about bot policy

### Schedule Not Working

**Check 1: Always On Mode**
- If bot has "Always On" enabled, it ignores schedules
- Disable "Always On" for schedule-based bots

**Check 2: Time Settings**
- Verify start/end times are correct
- Times are in 24-hour format
- Check days are selected

**Check 3: Auto Start Setting**
- Go to Settings
- Enable "Automatically start bots based on schedule"

### Bot Shows as "Connecting" Forever

**Possible Causes:**
- Server is offline
- Server address is wrong
- Network firewall blocking connection
- Server taking long time to respond

**Solution:**
- Check server status
- Verify address and port
- Try connecting with Minecraft client
- Check firewall settings

### Lost Configuration

**Bot Data Location:**
- All bot configs: `data/bots.json`
- All schedules: `data/schedule.json`
- These files are in the app's data folder

**Backup:**
- Copy the `data/` folder to backup your bots
- Restore by copying back to the app folder

## Tips & Tricks

### Efficient Bot Management

1. **Use Descriptive Names**
   - "StreamBot-Hypixel" better than "Bot1"
   - Include server name or purpose

2. **Group by Purpose**
   - Streaming bots: Use schedules
   - Background bots: Use Always On
   - Testing bots: Disable Auto Reconnect

3. **Monitor Logs Regularly**
   - Check for kick reasons
   - Watch for connection issues
   - Identify patterns

### Best Practices

✅ **DO:**
- Enable Auto Reconnect for production bots
- Use Always On for non-streaming bots
- Create schedules for streaming bots
- Test bots with offline mode first
- Back up your `data/` folder

❌ **DON'T:**
- Run too many bots on one server (respect limits)
- Use bots on servers that prohibit them
- Share your Microsoft password insecurely
- Delete bots without stopping them first

### Performance Tips

- **Many bots:** Consider spreading across multiple servers
- **Lag issues:** Reduce number of concurrent bots
- **Memory:** Close other applications if running many bots

## Keyboard Shortcuts

Currently the app uses mouse navigation. Future versions may include:
- Ctrl+B: Bots view
- Ctrl+S: Schedule view
- Ctrl+L: Logs view

## Support

For issues:
1. Check this guide first
2. Review the logs for error messages
3. Test connection with Minecraft client
4. Check server's bot policy

---

**Remember:** The key feature is that bots with "Always On" can stay connected and play on the server even outside their streaming schedule. This is perfect for background bots that maintain server presence!
