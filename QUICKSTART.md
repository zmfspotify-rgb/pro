# Quick Start Guide

## ⚡ Get Started in 5 Minutes

### 1️⃣ Launch the Application

Run `Minecraft Bot Manager Pro.exe`

### 2️⃣ Add a Bot

1. Click **"🤖 Bots"** in the sidebar
2. Click **"+ Add Bot"**
3. Fill in:
   - Name: `MyFirstBot`
   - Username: `BotUser123`
   - Password: *leave empty*
   - Server: `your-server-address.com`
   - Port: `25565`
   - ✅ Check **"Always On"**
   - ✅ Check **"Auto Reconnect"**
4. Click **"Save Bot"**

### 3️⃣ Start the Bot

1. Find your bot in the Bots section
2. Click **"▶️ Start"**
3. Watch it connect!

### 4️⃣ View Activity

1. Click **"📝 Logs"** in the sidebar
2. See real-time connection status
3. Check for any errors

---

## 🎯 Common Use Cases

### 🔴 Streaming Bot (Scheduled Hours)

**Use When:** You want a bot only during streaming hours

```
✅ Name: StreamBot
✅ Username: MyStreamBot
✅ Password: [empty]
✅ Server: play.server.com
✅ Port: 25565
⬜ Always On: OFF
✅ Auto Reconnect: ON

Then create a schedule:
- Days: Mon-Fri
- Time: 14:00 - 20:00 (2 PM - 8 PM)
```

### 🟢 Background Bot (24/7)

**Use When:** Bot should always be on server, not just for streaming

```
✅ Name: LobbyBot
✅ Username: BackgroundBot
✅ Password: [empty]
✅ Server: play.server.com
✅ Port: 25565
✅ Always On: ON  ← KEY SETTING
✅ Auto Reconnect: ON

No schedule needed - stays on 24/7!
```

---

## 🔑 Key Features at a Glance

| Feature | What It Does |
|---------|--------------|
| **Always On** | Bot stays connected 24/7, ignores schedules |
| **Auto Reconnect** | Bot reconnects automatically if disconnected |
| **Schedules** | Set specific days/times for bot activity |
| **Offline Mode** | No password needed, works on offline servers |
| **Online Mode** | Enter password for authenticated servers |

---

## 💡 Pro Tips

1. **For background bots:** Enable "Always On" ✅
2. **For streaming bots:** Create a schedule, disable "Always On" ⬜
3. **Test first:** Use offline mode to test before using real accounts
4. **Monitor logs:** Check for connection issues regularly
5. **Backup data:** Copy the `data/` folder to save your configs

---

## ❓ Quick Troubleshooting

**Bot won't connect?**
- ✅ Check server address
- ✅ Verify server is online
- ✅ Look at Logs for error messages

**Bot keeps disconnecting?**
- ✅ Check if server kicked bot (see logs)
- ✅ Ensure Auto Reconnect is ON
- ✅ Verify server allows bots

**Schedule not working?**
- ✅ Disable "Always On" for scheduled bots
- ✅ Check days and times are selected
- ✅ Enable auto-start in Settings

---

## 📚 Need More Help?

Read the full **USER_GUIDE.md** for detailed information!

---

**That's it!** You now have a functional bot running on your Minecraft server. 🎉
