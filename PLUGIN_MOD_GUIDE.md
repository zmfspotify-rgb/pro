# Plugin and Mod Guide

This guide explains how to use and configure plugins and mods for AI players.

## Table of Contents
1. [Plugin System](#plugin-system)
2. [Lifesteal SMP Plugin](#lifesteal-smp-plugin)
3. [Mod System](#mod-system)
4. [Simple Voice Chat Mod](#simple-voice-chat-mod)
5. [Configuration Editor](#configuration-editor)

## Plugin System

Plugins are server-side features that enhance AI player capabilities.

### Enabling Plugins

```json
{
  "plugins": {
    "enabled": true
  }
}
```

Set `enabled: true` to activate the plugin system. Individual plugins can be toggled separately.

## Lifesteal SMP Plugin

The Lifesteal SMP plugin adds heart-based PvP mechanics to AI players.

### How It Works

- **Starting Hearts:** Each AI player begins with 10 hearts
- **Kill Reward:** Gain 1 heart when killing another player (max 20)
- **Death Penalty:** Lose 1 heart when dying (min 2)
- **Elimination:** Players with minimum hearts are eliminated

### Configuration

```json
{
  "plugins": {
    "enabled": true,
    "lifeStealSMP": {
      "enabled": true,
      "maxHearts": 20,
      "minHearts": 2
    }
  }
}
```

**Settings:**
- `enabled` - Enable/disable Lifesteal plugin
- `maxHearts` - Maximum hearts a player can have (default: 20)
- `minHearts` - Minimum hearts before elimination (default: 2)

### In-Game Usage

**Check Hearts:**
```
!hearts
!hp
```

AI players will respond with their current heart count.

**Automatic Announcements:**
- When gaining a heart: "I gained a heart from [player]! Now at X hearts!"
- When at minimum: "I've been eliminated from the Lifesteal SMP!"

## Mod System

Mods are client-side features that run on each AI player.

### Enabling Mods

```json
{
  "mods": {
    "enabled": true
  }
}
```

## Simple Voice Chat Mod

Enables AI players to use voice communication with realistic voice models.

### Features

1. **Proximity Voice Chat**
   - AI players can hear players within configured distance
   - Respond with voice to nearby conversations
   - Uses configured voice model for TTS

2. **Private Voice Channels**
   - Create password-protected channels
   - Multiple players can join
   - Channels auto-delete when empty

3. **Whisper System**
   - Send private voice messages
   - Uses `/w` command format

4. **Voice Integration**
   - Uses AI player's configured voice model
   - Speaks through TTS system
   - Announces messages in game chat with 🎤 emoji

### Configuration

```json
{
  "mods": {
    "enabled": true,
    "simpleVoiceChat": {
      "enabled": true,
      "port": 24454,
      "voiceDistance": 48,
      "useVoiceModel": true,
      "allowPrivateChat": true
    }
  }
}
```

**Settings:**
- `enabled` - Enable/disable Simple Voice Chat
- `port` - Voice chat port (default: 24454)
- `voiceDistance` - Hearing range in blocks (default: 48)
- `useVoiceModel` - Use AI's voice model for TTS (default: true)
- `allowPrivateChat` - Enable private channels (default: true)

### Commands

#### Voice Chat Info
```
!voice
!vc
```
Shows voice chat status, distance, and mute state.

#### Mute/Unmute
```
!vmute
```
Toggles voice chat mute on/off.

#### Create Private Channel
```
!vcreate <channel_name>
!vcreate <channel_name> <password>
```

Examples:
- `!vcreate mining` - Create open channel "mining"
- `!vcreate secret pass123` - Create password-protected channel

#### Join Voice Channel
```
!vjoin <channel_name>
!vjoin <channel_name> <password>
```

Examples:
- `!vjoin mining` - Join open channel
- `!vjoin secret pass123` - Join with password

#### Leave Voice Channel
```
!vleave
```
Leaves current voice channel.

#### List Channels
```
!vlist
```
Shows all available voice channels.

#### Whisper
```
/w <player_name> <message>
```

Example:
- `/w Steve Hey, want to team up?`

### Voice Behavior

**Proximity Responses:**
- AI players have 15% chance to respond to nearby chat
- Only responds if player is within voice distance
- Uses natural delay (500-2000ms) before responding

**Voice Responses:**
- "I heard that!"
- "Good point!"
- "Interesting!"
- "I agree!"
- "Thanks for sharing!"

**Channel Communication:**
- Private channels isolate voice communication
- Only channel members can hear
- Messages prefixed with `[Private]` in logs

## Configuration Editor

Edit all settings with the interactive GUI!

### Opening the Editor

**From .exe:**
```bash
launcher.exe --config
```

**From source:**
```bash
npm run config
# OR
npm start -- --config
```

### Using the Editor

**Navigation:**
- **↑↓** - Move through menu
- **Enter** - Select menu item
- **Tab** - Switch between menu and content
- **'e'** - Edit current section
- **'a'** - Add new (AI Players)
- **'d'** - Delete (AI Players)
- **Ctrl+S** - Save configuration
- **Ctrl+C** - Exit

### Menu Options

1. **Server Settings** - Minecraft server address, port, version
2. **Twitch Settings** - Channel, OAuth, streaming options
3. **AI Players** - Add, edit, or remove AI players
4. **Features** - Toggle features on/off
5. **Plugins** - Configure Lifesteal SMP and other plugins
6. **Mods** - Configure Simple Voice Chat and other mods
7. **Save & Exit** - Save changes and close
8. **Exit Without Saving** - Discard changes

### Editing Plugins

1. Navigate to "Plugins" in menu
2. Press 'e' to edit
3. Follow prompts to change settings
4. Save with Ctrl+S

### Editing Mods

1. Navigate to "Mods" in menu
2. Press 'e' to edit
3. Configure Simple Voice Chat settings
4. Save with Ctrl+S

## Examples

### Example 1: Enable Lifesteal Plugin

```json
{
  "plugins": {
    "enabled": true,
    "lifeStealSMP": {
      "enabled": true,
      "maxHearts": 20,
      "minHearts": 2
    }
  }
}
```

### Example 2: Enable Voice Chat with Custom Distance

```json
{
  "mods": {
    "enabled": true,
    "simpleVoiceChat": {
      "enabled": true,
      "port": 24454,
      "voiceDistance": 64,
      "useVoiceModel": true,
      "allowPrivateChat": true
    }
  }
}
```

### Example 3: Full Configuration with All Features

```json
{
  "server": "play.myserver.com",
  "port": 25565,
  "version": "1.20.1",
  "aiPlayers": [
    {
      "id": "player1",
      "username": "VoiceBot",
      "voiceModel": "female_2_energetic",
      "personality": "friendly"
    }
  ],
  "plugins": {
    "enabled": true,
    "lifeStealSMP": {
      "enabled": true,
      "maxHearts": 20,
      "minHearts": 2
    }
  },
  "mods": {
    "enabled": true,
    "simpleVoiceChat": {
      "enabled": true,
      "port": 24454,
      "voiceDistance": 48,
      "useVoiceModel": true,
      "allowPrivateChat": true
    }
  },
  "features": {
    "voiceEnabled": true,
    "chatInteraction": true,
    "gameCommentary": true
  }
}
```

## Troubleshooting

### Plugins Not Working

1. Check `plugins.enabled` is `true`
2. Verify specific plugin is enabled
3. Restart launcher after config changes
4. Check console for plugin load messages

### Voice Chat Issues

1. Verify `mods.enabled` is `true`
2. Check `simpleVoiceChat.enabled` is `true`
3. Ensure voice model is configured
4. Check `features.voiceEnabled` is `true`
5. Verify TTS engine installed (OS-specific)

### Config Editor Not Saving

1. Check file permissions on config.json
2. Ensure config directory exists
3. Look for error messages in status bar
4. Try manual edit if GUI fails

## Tips

1. **Test Individually** - Enable one plugin/mod at a time for testing
2. **Use Config Editor** - Easier than manual JSON editing
3. **Check Logs** - Console shows plugin/mod loading status
4. **Voice Distance** - Start with 48 blocks, adjust as needed
5. **Private Channels** - Use passwords for secure team communication
6. **Lifesteal Balance** - Adjust max/min hearts for different gameplay styles
