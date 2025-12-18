# AISMP Free Launcher - Usage Guide

## Quick Start

### 1. Basic Launch

The simplest way to start the launcher:

```bash
python launcher.py
```

This will:
- Load `bots.yaml` configuration
- Launch all configured bots
- Display the real-time dashboard
- Connect bots to Minecraft servers
- Route bots to streaming platforms

### 2. Custom Configuration

Use a different configuration file:

```bash
python launcher.py /path/to/custom-config.yaml
```

### 3. Run Examples

To see working examples and test the setup:

```bash
python example.py
```

## Configuration Examples

### Minimal Bot Configuration

```yaml
bots:
  - name: "SimpleBot"
    username: "SimpleBot"
    auth_type: "offline"
    server:
      host: "mc.server.com"
      port: 25565
```

### Full-Featured Bot

```yaml
bots:
  - name: "AdvancedBot"
    username: "AdvancedBot"
    auth_type: "offline"
    
    server:
      host: "mc.server.com"
      port: 25565
      version: "1.19.2"
    
    skin:
      enabled: true
      source: "url"
      value: "https://mineskin.eu/skin/myskin"
      apply_method: "skinsrestorer"
    
    voice:
      enabled: true
      voice_id: 0
      rate: 150
      volume: 1.0
      output_device: "virtual_cable"
    
    streaming:
      enabled: true
      platforms:
        - name: "twitch"
          priority: 1
          channel: "my_channel"
          stream_key: "${TWITCH_KEY}"
          fallback: true
        - name: "youtube"
          priority: 2
          channel: "my_yt_channel"
          stream_key: "${YOUTUBE_KEY}"
          fallback: true
      
      ffmpeg:
        video_bitrate: "2500k"
        audio_bitrate: "128k"
        fps: 30
        resolution: "1920x1080"
```

## Platform Routing

### Priority System

Platforms are selected based on priority (lower number = higher priority):

```yaml
streaming:
  platforms:
    - name: "twitch"
      priority: 1    # Try Twitch first
    - name: "youtube"
      priority: 2    # Fallback to YouTube
    - name: "tiktok"
      priority: 3    # Last resort
```

### Capacity Management

Limit concurrent streams per platform:

```yaml
global:
  platform_limits:
    twitch: 2      # Max 2 simultaneous Twitch streams
    youtube: 5     # Max 5 simultaneous YouTube streams
    tiktok: 1      # Max 1 TikTok stream
```

When a platform reaches capacity, the next bot will use the next priority platform.

## Voice Configuration

### Available Voices

List available voices on your system:

```python
import pyttsx3
engine = pyttsx3.init()
voices = engine.getProperty('voices')
for i, voice in enumerate(voices):
    print(f"{i}: {voice.name}")
```

### Voice Settings

- **voice_id**: Index of the voice (0, 1, 2, etc.)
- **rate**: Speech rate in words per minute (default: 150)
  - Slower: 100-140
  - Normal: 140-180
  - Faster: 180-220
- **volume**: Volume level from 0.0 to 1.0

### Audio Routing for OBS

To route TTS audio to OBS:

1. Install a virtual audio cable (e.g., VB-Audio Virtual Cable)
2. Configure the virtual cable as the output device
3. In OBS, add the virtual cable as an audio source
4. Set `output_device` to the virtual cable name

## Skin Application

### SkinsRestorer Plugin

The launcher supports SkinsRestorer plugin:

```yaml
skin:
  enabled: true
  apply_method: "skinsrestorer"
  source: "url"
  value: "https://mineskin.eu/skin/ID"
```

### Custom Plugin Commands

For other skin plugins:

```yaml
skin:
  enabled: true
  apply_method: "plugin_command"
  source: "url"
  value: "https://example.com/skin.png"
```

### Skin Sources

- **url**: Direct URL to skin file
- **file**: Local file path
- **player**: Copy from existing player

## Streaming Setup

### Environment Variables

Set stream keys as environment variables:

```bash
# Linux/Mac
export TWITCH_STREAM_KEY_1="live_123456789_abcdefgh"
export YOUTUBE_STREAM_KEY_1="xxxx-yyyy-zzzz-wwww"

# Windows (PowerShell)
$env:TWITCH_STREAM_KEY_1="live_123456789_abcdefgh"
$env:YOUTUBE_STREAM_KEY_1="xxxx-yyyy-zzzz-wwww"
```

Or use a `.env` file (requires python-dotenv):

```
TWITCH_STREAM_KEY_1=live_123456789_abcdefgh
YOUTUBE_STREAM_KEY_1=xxxx-yyyy-zzzz-wwww
```

### FFmpeg Settings

Optimize for different scenarios:

**High Quality (Local Recording)**
```yaml
ffmpeg:
  video_bitrate: "6000k"
  audio_bitrate: "320k"
  fps: 60
  resolution: "1920x1080"
  preset: "slow"
```

**Balanced (Streaming)**
```yaml
ffmpeg:
  video_bitrate: "2500k"
  audio_bitrate: "128k"
  fps: 30
  resolution: "1920x1080"
  preset: "fast"
```

**Low Bandwidth**
```yaml
ffmpeg:
  video_bitrate: "1000k"
  audio_bitrate: "96k"
  fps: 30
  resolution: "1280x720"
  preset: "veryfast"
```

## Dashboard

### Real-Time Monitoring

The dashboard shows:
- **Bot Name**: Unique identifier
- **Connected**: Whether bot is connected to Minecraft server
- **Streaming**: Whether bot is actively streaming
- **Platform**: Which platform the bot is streaming to
- **Status**: Current status or error message

### Dashboard Controls

- **Ctrl+C**: Gracefully shutdown all bots
- Auto-refresh every 2 seconds (configurable)

### Disable Dashboard

To run without dashboard:

```yaml
global:
  dashboard:
    enabled: false
```

## Advanced Usage

### Multiple Configuration Files

Manage different setups:

```bash
# Development setup
python launcher.py configs/dev-bots.yaml

# Production setup
python launcher.py configs/prod-bots.yaml

# Testing setup
python launcher.py configs/test-bots.yaml
```

### Selective Bot Launch

Modify the launcher to launch specific bots:

```python
from launcher import AISMPLauncher

launcher = AISMPLauncher('bots.yaml')
launcher.loadConfig()

# Launch only specific bots
for bot in launcher.config['bots']:
    if bot['name'] in ['StreamBot1', 'StreamBot3']:
        launcher.launchBot(bot)
```

### Custom Event Handlers

Extend the launcher with custom functionality:

```python
class CustomLauncher(AISMPLauncher):
    def launchBot(self, bot_config):
        # Custom pre-launch logic
        print(f"Custom launch for {bot_config['name']}")
        
        # Call parent method
        result = super().launchBot(bot_config)
        
        # Custom post-launch logic
        if result:
            print(f"Bot {bot_config['name']} is ready!")
        
        return result
```

## Troubleshooting

### Bot Connection Issues

**Problem**: Bot won't connect to server

**Solutions**:
1. Check server is online: `ping mc.server.com`
2. Verify port is correct (default: 25565)
3. Check firewall settings
4. Ensure server allows offline mode (if using offline auth)

### Streaming Issues

**Problem**: Stream not appearing on platform

**Solutions**:
1. Verify stream key is correct
2. Check platform API status
3. Ensure FFmpeg is installed: `ffmpeg -version`
4. Check network bandwidth
5. Review FFmpeg logs for errors

### Voice/TTS Issues

**Problem**: TTS not working

**Solutions**:
1. Install pyttsx3: `pip install pyttsx3`
2. Check available voices: `python -c "import pyttsx3; print(pyttsx3.init().getProperty('voices'))"`
3. On Linux, install espeak: `sudo apt-get install espeak`
4. Verify audio output device exists

### Platform Capacity

**Problem**: Bots not streaming due to capacity

**Solutions**:
1. Increase platform limits in configuration
2. Add more platform options with lower priority
3. Review which bots need streaming
4. Stagger bot launches

## Best Practices

### Security

- Never commit stream keys to version control
- Use environment variables for sensitive data
- Rotate stream keys regularly
- Use `.gitignore` for configuration backups

### Performance

- Limit concurrent bots to server capacity
- Use appropriate FFmpeg presets for CPU usage
- Monitor system resources (CPU, RAM, bandwidth)
- Adjust refresh rate if dashboard causes lag

### Organization

- Use descriptive bot names
- Group similar configurations
- Document custom settings
- Keep backup configurations

### Reliability

- Set reasonable retry limits
- Use fallback platforms
- Monitor logs for issues
- Test configuration before production use

## Integration Examples

### With OBS Studio

1. Setup virtual audio cable for TTS
2. Add Minecraft window as video source
3. Add virtual cable as audio source
4. Use launcher's streaming instead of OBS streaming

### With Discord Bots

Combine with Discord bot to control launcher:

```python
# Discord bot command to launch bots
@bot.command()
async def launch_bots(ctx):
    launcher = AISMPLauncher('bots.yaml')
    launcher.loadConfig()
    launcher.launchAll()
    await ctx.send("Bots launched!")
```

### With Web Dashboard

Create a web interface using Flask:

```python
from flask import Flask, render_template
from launcher import AISMPLauncher

app = Flask(__name__)
launcher = AISMPLauncher('bots.yaml')

@app.route('/status')
def status():
    return render_template('status.html', 
                         bots=launcher.bots_status)
```

## Support

For issues and questions:
1. Check the logs: `logs/aismp_launcher.log`
2. Review configuration syntax
3. Test with example configuration
4. Check dependency versions

## Next Steps

After basic setup:
1. Customize bot configurations
2. Setup streaming keys
3. Configure voice preferences
4. Test with small number of bots
5. Scale up to full deployment
6. Monitor and optimize performance
