# AISMP Free Launcher

**Automated Intelligent Streaming Minecraft Player Launcher**

A comprehensive multi-bot management system for Minecraft SMP with streaming capabilities, voice integration, and dynamic skin application.

## Features

- 🤖 **Multi-Bot Management**: Launch and manage multiple Minecraft bots simultaneously using pyCraft
- 🎨 **Dynamic Skin Application**: Apply Minecraft skins via SkinsRestorer or custom plugin commands
- 🗣️ **TTS Voice Integration**: Offline text-to-speech using PyTTSx3 with audio routing for OBS/FFmpeg
- 📺 **Multi-Platform Streaming**: Intelligent routing to Twitch, YouTube, TikTok with automatic fallback
- 📊 **Real-Time Dashboard**: Live CLI dashboard showing bot status and streaming information
- ⚙️ **YAML Configuration**: Easy-to-configure bot settings via `bots.yaml`

## Installation

### Prerequisites

- Python 3.8 or higher
- FFmpeg (for streaming features)
- Virtual audio cable (for TTS routing to OBS)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install pyCraft (Minecraft protocol library):
```bash
# Option 1: From PyPI (if available)
pip install minecraft

# Option 2: From GitHub (recommended for latest version)
pip install git+https://github.com/ammaraskar/pyCraft.git
```

4. Configure your bots:
```bash
cp bots.yaml bots.yaml.example
nano bots.yaml  # Edit with your settings
```

5. Set up environment variables for stream keys:
```bash
export TWITCH_STREAM_KEY_1="your_twitch_key"
export YOUTUBE_STREAM_KEY_1="your_youtube_key"
# Add more as needed
```

## Configuration

The `bots.yaml` file contains all bot configurations. Here's a breakdown of the main sections:

### Bot Configuration

Each bot requires the following settings:

- **name**: Unique identifier for the bot
- **username**: Minecraft username
- **auth_type**: Authentication method (`offline`, `microsoft`, `mojang`)
- **server**: Minecraft server connection details
- **skin**: Skin application settings
- **voice**: TTS configuration
- **streaming**: Streaming platform preferences

### Example Bot Configuration

```yaml
bots:
  - name: "StreamBot1"
    username: "StreamBot1"
    auth_type: "offline"
    
    server:
      host: "localhost"
      port: 25565
      version: "1.19.2"
    
    skin:
      enabled: true
      source: "url"
      value: "https://mineskin.eu/skin/example1"
      apply_method: "skinsrestorer"
    
    voice:
      enabled: true
      voice_id: 0
      rate: 150
      volume: 1.0
    
    streaming:
      enabled: true
      platforms:
        - name: "twitch"
          priority: 1
          channel: "streambot1_channel"
          stream_key: "${TWITCH_STREAM_KEY_1}"
```

### Global Settings

- **connection**: Retry and timeout settings
- **platform_limits**: Maximum concurrent streams per platform
- **logging**: Log level and output configuration
- **dashboard**: Real-time monitoring settings

## Usage

### Basic Usage

Launch all configured bots:
```bash
python launcher.py
```

Use a custom configuration file:
```bash
python launcher.py /path/to/custom-bots.yaml
```

### Dashboard

The launcher includes a real-time CLI dashboard that displays:
- Bot connection status
- Streaming platform assignments
- Active/inactive bots
- Platform capacity usage
- Error messages

Press `Ctrl+C` to gracefully shutdown all bots.

## Core Components

### 1. `loadConfig()`
Loads and parses the `bots.yaml` configuration file, validates settings, and initializes the platform manager.

### 2. `launchBot(bot_config)`
Launches a single bot with the following steps:
- Applies skin (if enabled)
- Configures TTS voice
- Routes to streaming platform
- Connects to Minecraft server

### 3. `applySkin(bot_config)`
Dynamically applies Minecraft skins using:
- SkinsRestorer plugin commands
- Custom plugin integrations
- RCON commands (when available)

### 4. `setupTTS(bot_config)`
Configures PyTTSx3 for offline text-to-speech:
- Selects voice model
- Sets speech rate and volume
- Configures audio routing for OBS/FFmpeg

### 5. `routeStream(bot_config)`
Intelligently routes bots to streaming platforms:
- Respects priority preferences
- Checks platform capacity limits
- Automatically falls back to alternative platforms
- Sets up FFmpeg streaming pipeline

### 6. `showDashboard()`
Displays real-time dashboard with:
- Bot status overview
- Streaming platform assignments
- Connection statistics
- Platform capacity usage

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AISMP Launcher                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Bot 1      │  │   Bot 2      │  │   Bot 3      │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ pyCraft      │  │ pyCraft      │  │ pyCraft      │     │
│  │ Connection   │  │ Connection   │  │ Connection   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│  ┌──────▼─────────────────▼─────────────────▼────────┐    │
│  │         Stream Platform Manager                   │    │
│  │  - Capacity Management                            │    │
│  │  - Priority Routing                               │    │
│  │  - Fallback Handling                              │    │
│  └──────┬─────────────────┬─────────────────┬────────┘    │
│         │                 │                 │              │
│    ┌────▼────┐      ┌─────▼─────┐     ┌────▼────┐        │
│    │ Twitch  │      │  YouTube  │     │ TikTok  │        │
│    └─────────┘      └───────────┘     └─────────┘        │
│                                                            │
├─────────────────────────────────────────────────────────────┤
│  Additional Components:                                    │
│  - Skin Applicator (SkinsRestorer)                        │
│  - TTS Engine (PyTTSx3)                                   │
│  - FFmpeg Pipeline                                        │
│  - Real-time Dashboard                                    │
└─────────────────────────────────────────────────────────────┘
```

## Streaming Pipeline

The launcher creates an FFmpeg pipeline for each bot:

1. **Video Input**: Screen capture from Minecraft window
2. **Audio Input**: TTS output via virtual audio cable
3. **Encoding**: H.264 video + AAC audio
4. **Output**: RTMP stream to platform

## Advanced Features

### Custom Voice Models
Configure different voices for each bot:
```yaml
voice:
  voice_id: 0  # System voice index
  rate: 150    # Words per minute
  volume: 1.0  # 0.0 to 1.0
```

### Platform Capacity Management
Limit concurrent streams per platform:
```yaml
platform_limits:
  twitch:
    max_concurrent: 2
  youtube:
    max_concurrent: 5
```

### Intelligent Fallback
Automatically route to alternative platforms when capacity is full:
```yaml
platforms:
  - name: "twitch"
    priority: 1
    fallback: true
  - name: "youtube"
    priority: 2
    fallback: true
```

## Troubleshooting

### Common Issues

**Bot won't connect to server:**
- Verify server host and port in `bots.yaml`
- Check if server is online and accepting connections
- Ensure correct Minecraft version compatibility

**Skin not applying:**
- Verify SkinsRestorer plugin is installed on server
- Check skin URL is accessible
- Ensure bot has permission to change skins

**TTS not working:**
- Install pyttsx3: `pip install pyttsx3`
- Check system has TTS voices installed
- Verify audio routing configuration

**Streaming issues:**
- Verify FFmpeg is installed: `ffmpeg -version`
- Check stream keys are correctly set in environment
- Ensure platform limits are not exceeded

### Logs

Check logs for detailed error information:
```bash
tail -f logs/aismp_launcher.log
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

This project is provided as-is for educational and personal use.

## Acknowledgments

- **pyCraft**: Minecraft protocol library
- **PyTTSx3**: Text-to-speech engine
- **SkinsRestorer**: Minecraft skin plugin
- **FFmpeg**: Media processing framework
