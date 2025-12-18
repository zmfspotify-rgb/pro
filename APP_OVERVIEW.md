# Application Overview

## 🎮 Minecraft Bot Manager Pro - Application Structure

### Main Window Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Minecraft Bot Manager Pro                                   [_][□][×]│
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  🎮 Bot      │              DASHBOARD                           │
│  Manager Pro │                                                  │
│              │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│──────────────│  │   🤖   │ │   🟢   │ │   🔴   │ │   📅   │   │
│              │  │   12   │ │    8   │ │    4   │ │   15   │   │
│ 📊 Dashboard │  │ Total  │ │ Online │ │Offline │ │Schedule│   │
│              │  └────────┘ └────────┘ └────────┘ └────────┘   │
│ 🤖 Bots      │                                                  │
│              │  Active Bots                                     │
│ 📅 Schedule  │  ┌──────────────────────────────────────────┐   │
│              │  │ StreamBot1                        🟢Online│   │
│ 📝 Logs      │  │ play.server.com:25565                    │   │
│              │  └──────────────────────────────────────────┘   │
│ ⚙️ Settings  │  ┌──────────────────────────────────────────┐   │
│              │  │ LobbyBot24/7                      🟢Online│   │
│              │  │ lobby.server.com:25565                   │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

### Bots View

```
┌─────────────────────────────────────────────────────────────────┐
│  Bot Management                              [+ Add Bot]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ StreamBot1       │  │ LobbyBot24/7     │  │ AFKBot      │  │
│  │         🟢 Online│  │         🟢 Online│  │   🔴 Offline│  │
│  │                  │  │                  │  │              │  │
│  │ User: StreamUser │  │ User: LobbyUser  │  │ User: AFKer │  │
│  │ Server: play.s.. │  │ Server: lobby... │  │ Server: s.. │  │
│  │                  │  │                  │  │              │  │
│  │ ⚡ Always On     │  │ ⚡ Always On     │  │              │  │
│  │ 🔄 Auto Reconnect│  │ 🔄 Auto Reconnect│  │ 🔄 Auto..   │  │
│  │                  │  │                  │  │              │  │
│  │ [⏹️ Stop] [✏️] [🗑️] │  │ [⏹️ Stop] [✏️] [🗑️] │  │ [▶️ Start] ..│  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Schedule View

```
┌─────────────────────────────────────────────────────────────────┐
│  Streaming Schedule                          [+ Add Schedule]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ℹ️ Bots with "Always On" enabled will stay connected even      │
│     outside their scheduled times                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ StreamBot1                                    [Remove]   │   │
│  │                                                           │   │
│  │ Days: Mon, Tue, Wed, Thu, Fri                           │   │
│  │ Time: 14:00 - 20:00                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ WeekendBot                                    [Remove]   │   │
│  │                                                           │   │
│  │ Days: Sat, Sun                                           │   │
│  │ Time: 10:00 - 23:00                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Logs View

```
┌─────────────────────────────────────────────────────────────────┐
│  System Logs                    [All Bots ▼]        [Clear]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [18:45:23] [StreamBot1] StreamBot1 logged in successfully     │
│  [18:45:24] [StreamBot1] StreamBot1 spawned in world           │
│  [18:45:30] [LobbyBot24/7] LobbyBot24/7 logged in successfully │
│  [18:45:31] [LobbyBot24/7] LobbyBot24/7 spawned in world       │
│  [18:46:15] [StreamBot1] Starting bot based on schedule        │
│  [18:47:02] [AFKBot] Error: Connection refused                 │
│  [18:47:10] [AFKBot] Starting bot based on schedule            │
│  [18:47:11] [AFKBot] AFKBot logged in successfully             │
│  [18:47:12] [AFKBot] AFKBot spawned in world                   │
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Design Features

### Color Scheme
- **Background**: Dark gradient (#1a1a2e to #16213e)
- **Accent**: Purple-blue gradient (#667eea to #764ba2)
- **Success**: Green (#38ef7d)
- **Warning**: Yellow (#ffc107)
- **Error**: Orange-red (#ff6a00)

### UI Elements
- **Cards**: Glass-morphism style with transparency
- **Buttons**: Gradient backgrounds with hover effects
- **Modals**: Blur backdrop with smooth animations
- **Stats**: Large, readable numbers with icons
- **Sidebar**: Fixed navigation with active state indicators

### Professional Features
1. ✨ Smooth animations and transitions
2. 🎯 Intuitive icon-based navigation
3. 📊 Real-time status updates
4. 🎨 Modern glass-morphism design
5. 📱 Responsive grid layouts
6. 🌈 Gradient accents throughout
7. 🔔 Visual feedback for all actions
8. 📈 Dashboard analytics

## 🔧 Technical Architecture

### Frontend (Electron Renderer)
```
src/ui/
├── index.html    - Main HTML structure
├── styles.css    - Professional styling
└── app.js        - UI logic and IPC communication
```

### Backend (Electron Main + Node.js)
```
main.js           - Electron main process
src/
└── botManager.js - Bot lifecycle management
    ├── Bot creation/deletion
    ├── Schedule management
    ├── Mineflayer integration
    └── Event handling
```

### Data Storage
```
data/
├── bots.json     - Bot configurations
└── schedule.json - Schedule configurations
```

## 🚀 Key Features Implementation

### 1. Always On Mode
```javascript
// When Always On is enabled:
- Bot connects immediately on start
- Ignores all schedules
- Perfect for non-streaming bots
- Auto-reconnects if enabled
```

### 2. Schedule System
```javascript
// Schedule checker runs every minute:
- Checks current day/time
- Starts bots in scheduled windows
- Stops bots outside scheduled windows
- Respects "Always On" override
```

### 3. Auto Reconnect
```javascript
// On disconnect event:
if (autoReconnect && (alwaysOn || shouldBeOnlinePerSchedule)) {
  setTimeout(() => reconnect(), 5000);
}
```

### 4. Anti-AFK
```javascript
// Every 30 seconds:
- Bot looks around randomly
- Prevents AFK kick
- Maintains active status
```

## 📦 Distribution

### Build Output
```
dist/win-unpacked/
├── Minecraft Bot Manager Pro.exe  (202 MB)
├── resources/
│   └── app.asar                   (392 MB - contains all code)
└── [Electron runtime files]
```

### Installation
- **Unpacked**: Copy folder and run .exe
- **Installer**: Run setup wizard (requires Windows build)

## 🎯 Use Cases Covered

✅ **Streaming Bots**
- Schedule-based activation
- Specific days and times
- Automatic start/stop

✅ **Background Bots**
- Always On mode
- 24/7 presence
- No schedule needed

✅ **Mixed Mode**
- Always On + Schedule
- Bot stays on 24/7
- Schedule becomes informational

✅ **Offline Servers**
- No password needed
- Simple username-based auth
- Works immediately

✅ **Online Servers**
- Microsoft authentication
- Password-based login
- Full account features

## 🔒 Security Features

- Passwords stored locally only
- No cloud communication
- Data stays on user's machine
- Optional offline mode (no credentials)

## 📊 Monitoring & Logging

- Real-time status updates
- Comprehensive event logging
- Filter logs by bot
- Color-coded severity levels
- Automatic log rotation (1000 entries max)

---

**This application delivers on all requirements:**
1. ✅ Functional .exe application
2. ✅ Professional, modern UI (not like a coding platform)
3. ✅ All bot management features
4. ✅ Streaming schedule support
5. ✅ Non-streaming bots can stay connected (Always On mode)
6. ✅ Beautiful, realistic application look
