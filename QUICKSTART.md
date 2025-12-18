# AISMP Free Launcher - Quick Start Guide

## Prerequisites
```bash
# Install Python 3.8+
python3 --version

# Install pip packages
pip install PyYAML pyttsx3

# Optional: Install pyCraft for Minecraft connections
pip install git+https://github.com/ammaraskar/pyCraft.git

# Optional: Install FFmpeg for streaming
# Ubuntu/Debian: sudo apt install ffmpeg
# macOS: brew install ffmpeg
# Windows: Download from ffmpeg.org
```

## Installation
```bash
# Clone the repository
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro

# Install dependencies
pip install -r requirements.txt
```

## Configuration

### 1. Set Stream Keys (Optional)
```bash
# Linux/macOS
export TWITCH_STREAM_KEY_1="live_123456789_abcdefgh"
export YOUTUBE_STREAM_KEY_1="xxxx-yyyy-zzzz-wwww"

# Windows PowerShell
$env:TWITCH_STREAM_KEY_1="live_123456789_abcdefgh"
$env:YOUTUBE_STREAM_KEY_1="xxxx-yyyy-zzzz-wwww"
```

### 2. Edit Configuration
Edit `bots.yaml` to customize:
- Bot names and usernames
- Server connection details
- Skin URLs
- Voice settings
- Streaming platforms
- Platform priorities

## Usage

### Run the Launcher
```bash
python launcher.py
```

You'll see:
```
AISMP Free Launcher - Automated Intelligent Streaming Minecraft Player
================================================================================
[timestamp] - AISMP - INFO - Configuration loaded successfully: 3 bots configured
[timestamp] - AISMP - INFO - Starting AISMP Launcher...
[timestamp] - AISMP - INFO - Launching bot: StreamBot1
[timestamp] - AISMP - INFO - Bot StreamBot1 routed to twitch
...
```

### Dashboard View
```
================================================================================
                    AISMP FREE LAUNCHER - DASHBOARD
================================================================================

Last Update: 2025-12-18 07:30:58
Active Bots: 3/3

--------------------------------------------------------------------------------

Bot Name             Connected    Streaming    Platform        Status              
--------------------------------------------------------------------------------
StreamBot1          ✓ Yes        ✓ Yes        twitch          Running
StreamBot2          ✓ Yes        ✓ Yes        twitch          Running
StreamBot3          ✓ Yes        ✓ Yes        youtube         Running

--------------------------------------------------------------------------------

Platform Usage:
  Twitch         2/2
  Youtube        1/5

================================================================================
Press Ctrl+C to stop the launcher
```

### Run Examples
```bash
python example.py
```

This demonstrates:
- Configuration loading
- Single bot launch
- Platform routing
- Capacity management

## Common Scenarios

### Scenario 1: Testing Without Minecraft Server
- Use offline mode authentication
- Launcher will simulate connections
- Perfect for testing configuration

### Scenario 2: Live Minecraft Bots
- Set up Minecraft server
- Configure server address in bots.yaml
- Install pyCraft
- Launch bots

### Scenario 3: Streaming Only
- Disable Minecraft connection
- Focus on streaming setup
- Use existing video source
- Configure FFmpeg pipeline

## Troubleshooting

### "Configuration not loaded"
- Check bots.yaml syntax
- Validate YAML format: `python -c "import yaml; yaml.safe_load(open('bots.yaml'))"`

### "No platform available"
- Check platform limits in config
- Increase max_concurrent values
- Add more platform options

### "pyCraft not available"
- Install: `pip install git+https://github.com/ammaraskar/pyCraft.git`
- Or use offline simulation mode

### "TTS not working"
- Install: `pip install pyttsx3`
- Linux: `sudo apt-get install espeak`
- Check available voices: See USAGE.md

## Next Steps

1. ✅ **Read Documentation**
   - README.md for overview
   - USAGE.md for detailed guide
   - IMPLEMENTATION.md for technical details

2. ✅ **Customize Configuration**
   - Edit bot names
   - Set server addresses
   - Configure platforms
   - Adjust settings

3. ✅ **Test Setup**
   - Run example.py
   - Verify configuration
   - Check logs

4. ✅ **Deploy**
   - Set stream keys
   - Launch bots
   - Monitor dashboard

## Support

- Check logs: `logs/aismp_launcher.log`
- Review documentation
- Test with examples
- Validate configuration

## Learn More

- **README.md**: Complete feature overview
- **USAGE.md**: Advanced usage patterns
- **IMPLEMENTATION.md**: Technical architecture
- **example.py**: Working code examples

---

**Ready to launch?** Run: `python launcher.py`
