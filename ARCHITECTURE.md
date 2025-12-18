# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        iOS Mobile App                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Home Screen │  │ Bot Control  │  │   Settings   │          │
│  │              │  │    Screen    │  │    Screen    │          │
│  │  - Bot List  │  │  - Start/Stop│  │  - Edit      │          │
│  │  - Status    │  │  - Streaming │  │    Config    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                           │                                      │
│                    ┌──────────────┐                             │
│                    │   Schedule   │                             │
│                    │    Screen    │                             │
│                    │  - Manage    │                             │
│                    │    Times     │                             │
│                    └──────────────┘                             │
│                           │                                      │
│                    ┌──────────────┐                             │
│                    │  API Service │                             │
│                    └──────────────┘                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────┴───────────────────────────────────┐
│                      Backend Server (Node.js)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express API Server                     │  │
│  │  /api/bots | /api/config | /api/schedule | /health       │  │
│  └───────┬────────────────┬─────────────────┬────────────────┘  │
│          │                │                 │                    │
│  ┌───────▼─────┐  ┌──────▼──────┐  ┌──────▼─────────┐         │
│  │    Bot      │  │   Config    │  │   Schedule     │         │
│  │   Manager   │  │   Manager   │  │    Manager     │         │
│  └───────┬─────┘  └─────────────┘  └────────┬───────┘         │
│          │                                    │                  │
│          │         ┌──────────────────────────┘                 │
│          │         │                                            │
│  ┌───────▼─────────▼────────────────────────────────────────┐  │
│  │              Minecraft Bots (Multiple Instances)         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │   Bot 1     │  │   Bot 2     │  │   Bot N     │      │  │
│  │  │             │  │             │  │             │      │  │
│  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │      │  │
│  │  │ │AI Task  │ │  │ │AI Task  │ │  │ │AI Task  │ │      │  │
│  │  │ │Executor │ │  │ │Executor │ │  │ │Executor │ │      │  │
│  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │      │  │
│  │  │             │  │             │  │             │      │  │
│  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │      │  │
│  │  │ │Twitch   │ │  │ │Twitch   │ │  │ │Twitch   │ │      │  │
│  │  │ │Chat     │ │  │ │Chat     │ │  │ │Chat     │ │      │  │
│  │  │ │Responder│ │  │ │Responder│ │  │ │Responder│ │      │  │
│  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  └──────┬──────────────────┬──────────────────┬─────────────┘  │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│                  │  │             │  │                │
│   Minecraft      │  │   Twitch    │  │   Twitch       │
│     Server       │  │   Streaming │  │   Chat (IRC)   │
│                  │  │   (RTMP)    │  │                │
│  - Game World    │  │ - FFmpeg    │  │  - tmi.js      │
│  - Mineflayer    │  │ - Video     │  │  - Messages    │
│                  │  │ - Audio/TTS │  │  - Responses   │
└──────────────────┘  └─────────────┘  └────────────────┘
```

## Data Flow

### Bot Launch Flow
```
iOS App (Tap Start) 
    → API Request (POST /api/bots/start)
    → Bot Manager
    → Create Minecraft Bot Instance
    → Connect to Minecraft Server
    → Initialize AI Task Executor
    → Initialize Chat Responder
    → Return Success
    → Update iOS App UI
```

### Streaming Flow
```
Schedule Trigger (cron)
    → Schedule Manager
    → Bot Manager
    → Start Streaming
    → Initialize Twitch Streamer
    → Configure FFmpeg
    → Connect to Twitch Chat
    → Start Stream (RTMP)
    → Monitor Chat
    → Generate AI Responses
    → Speak with TTS
    → Continue until duration expires
```

### Chat Interaction Flow
```
Viewer Message in Twitch Chat
    → Twitch IRC (tmi.js)
    → Chat Responder
    → Pattern Matching
    → AI Response Generation
    → Send to Twitch Chat
    → If Voice Enabled → TTS (say.js)
    → Also Send to Minecraft Chat
```

### Task Execution Flow
```
Schedule or Manual Command
    → AI Task Executor
    → Parse Task Type
    → Execute Action:
        - Mining: Find blocks → Dig
        - Building: Place blocks at positions
        - Farming: Find crops → Harvest → Replant
        - Hunting: Find mobs → Attack
        - Exploring: Calculate path → Navigate
    → Update Current Task Status
    → Report to iOS App
```

## Component Interactions

### iOS App → Backend
- REST API calls (JSON over HTTP)
- Poll for status updates
- Send configuration updates
- Trigger bot actions

### Backend → Minecraft
- Mineflayer library
- Direct connection to server
- Send commands
- Receive events

### Backend → Twitch
- RTMP streaming (FFmpeg)
- IRC chat (tmi.js)
- OAuth authentication
- Real-time messaging

### Schedule Manager
- Cron jobs for timing
- Triggers bot actions
- Manages stream duration
- Executes activities

## Technology Stack

### Frontend (iOS)
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **HTTP**: Axios
- **Storage**: AsyncStorage
- **Build**: EAS (Expo Application Services)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Bot Library**: Mineflayer
- **Pathfinding**: mineflayer-pathfinder
- **Chat**: tmi.js (Twitch)
- **Scheduling**: node-cron
- **Streaming**: fluent-ffmpeg
- **Voice**: say.js (TTS)

### Data Storage
- **Config**: JSON files
- **Schedules**: JSON files
- **State**: In-memory (Map)

## Scalability

### Current Architecture
- Multiple bots per instance
- Single backend server
- File-based configuration

### Potential Scaling
- Add database (PostgreSQL/MongoDB)
- Load balancer for multiple backend instances
- Redis for state management
- Message queue for tasks (RabbitMQ/Redis)
- Separate streaming service
- Container orchestration (Docker/Kubernetes)

## Security Layers

### iOS App
- HTTPS for API calls (production)
- Secure storage for credentials
- Input validation

### Backend
- CORS configuration
- Environment variables
- Input sanitization
- Error handling

### Network
- Private networks preferred
- VPN for remote access
- Firewall rules
- OAuth for Twitch

## Deployment Architecture

```
┌─────────────────┐
│   iPhone/iPad   │
│   (iOS App)     │
└────────┬────────┘
         │
         │ Internet
         │
┌────────▼────────────────────────────┐
│     Backend Server (Options)        │
│                                     │
│  Option 1: Home Computer            │
│  - Local Network                    │
│  - Port Forwarding                  │
│                                     │
│  Option 2: Cloud Hosting            │
│  - Heroku/Railway/AWS               │
│  - Always Available                 │
│                                     │
│  Option 3: VPS                      │
│  - DigitalOcean/Linode              │
│  - Full Control                     │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌─▼──────┐
│Minecraft│ │ Twitch │
│ Server │ │        │
└────────┘ └────────┘
```

## File Organization

```
pro/
├── backend/              # Backend server code
│   ├── server.js        # Main API server
│   ├── bot-manager.js   # Bot lifecycle
│   ├── minecraft-bot.js # MC integration
│   └── ...
├── ios-app/             # iOS application
│   ├── App.js          # Main app
│   ├── src/
│   │   ├── screens/    # UI screens
│   │   └── services/   # API client
│   └── ...
├── config/              # Configuration
│   ├── config.json     # Main config
│   └── schedules.json  # Schedules
├── *.md                # Documentation
└── setup.sh            # Setup script
```

## API Flow Example

```
1. User taps "Start Bot 1" in iOS app

2. App sends: POST /api/bots/start
   Body: { "botId": "bot1" }

3. Backend receives request
   - Validates botId
   - Loads bot config
   - Creates bot instance

4. Bot Manager:
   - Initializes Mineflayer bot
   - Connects to Minecraft server
   - Sets up event handlers
   - Creates AI executor

5. Backend responds:
   Success: { "success": true, "message": "Bot bot1 started" }

6. App updates UI:
   - Status: Running ✅
   - Connection: Connected ✅
   - Shows current task

7. User can now:
   - Start streaming
   - View status
   - Stop bot
```

This architecture provides a robust, scalable system for managing Minecraft AI bots remotely via iOS!
