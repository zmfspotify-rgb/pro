# AvatarOS User Guide

Complete guide to using AvatarOS - the AI-powered Minecraft bot system with memory and dynamic learning.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Uploading Plugins & Mods](#uploading-plugins--mods)
3. [AI Memory System](#ai-memory-system)
4. [Configuration](#configuration)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

1. **Clone or Download** the repository
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Build AvatarOS** (optional, for .exe):
   ```bash
   npm run build
   ```

### First Run

```bash
# Run from source
npm start

# Or run the built executable
dist/AvatarOS.exe
```

On first run, AvatarOS will:
- Create memory storage directory
- Initialize AI memory for each player
- Scan for uploaded plugins/mods
- Connect AI bots to Minecraft server

## Uploading Plugins & Mods

### How to Upload Plugins

1. **Get Your Plugin**
   - Download any Minecraft server plugin (.jar file)
   - Or create custom JavaScript plugin (.js file)

2. **Upload to AvatarOS**
   - Place the file in `/plugins` directory
   - Example: `/plugins/MyAwesomePlugin.jar`

3. **Auto-Discovery**
   - Restart AvatarOS or wait for next bot spawn
   - AI automatically finds and analyzes the plugin
   - Commands and features are discovered

4. **AI Learning**
   - AI bots test discovered commands
   - Successful uses are remembered
   - Failed attempts are also learned from

### How to Upload Mods

1. **Get Your Mod**
   - Download any Minecraft client mod (.jar file)
   - Or create custom JavaScript mod (.js file)

2. **Upload to AvatarOS**
   - Place the file in `/mods` directory
   - Example: `/mods/CoolClientMod.jar`

3. **Auto-Discovery & Learning**
   - Same process as plugins
   - AI learns keybinds, commands, and features

### Supported Plugins & Mods

**Plugins (Server-Side):**
- Lifesteal SMP
- Factions
- WorldEdit
- EssentialsX
- LuckPerms
- Any Bukkit/Spigot/Paper plugin

**Mods (Client-Side):**
- Simple Voice Chat
- JourneyMap
- Litematica
- Tweakeroo
- VoxelMap
- Any Forge/Fabric/Quilt mod

## AI Memory System

### Memory Structure

Each AI player maintains:

**Short-term Memory (Last 100 events)**
- Recent chat messages
- Player interactions
- Actions taken
- Outcomes observed

**Long-term Memory (Last 1000 important events)**
- Significant achievements
- Major interactions
- Plugin/mod discoveries
- Learned patterns

**Learned Behaviors**
- Actions and their success rates
- Best strategies for situations
- Preferred approaches

**Plugin/Mod Knowledge**
- Discovered capabilities
- Commands that work
- Features available
- Usage patterns

**Player Relationships**
- First met timestamps
- Interaction history
- Relationship status (friendly/neutral/hostile)

### How AI Thinks

When AI needs to make a decision:

1. **Recall** relevant memories
2. **Analyze** past success rates
3. **Consider** available plugins/mods
4. **Suggest** top 5 actions
5. **Choose** highest confidence action

Example:
```
Situation: Player asks for help mining

AI Thinks:
1. Check if we have a mining plugin (70% confidence)
2. Use pathfinding to reach player (85% confidence) ← CHOSEN
3. Send chat response (60% confidence)
```

### Memory Commands

Bots understand memory-related chat commands:

- `!memory` - Show memory stats
- `!remember <event>` - Force remember something
- `!forget <topic>` - Clear specific memories
- `!recall <query>` - Search memory

### Memory Files

Located in `/memory/<player_id>.json`

Example structure:
```json
{
  "longTerm": [
    {
      "timestamp": "2025-12-18T20:00:00Z",
      "type": "achievement",
      "data": "Learned to use WorldEdit plugin",
      "importance": 8
    }
  ],
  "behaviors": {
    "mining_with_player": {
      "uses": 15,
      "successes": 12,
      "failures": 3
    }
  },
  "plugins": {
    "WorldEdit": {
      "discovered": "2025-12-18T19:00:00Z",
      "commands": ["//set", "//replace", "//copy"],
      "effectivenessRating": 8.5
    }
  }
}
```

## Configuration

### Quick Config with Editor

```bash
npm run config
```

Navigate with arrow keys, edit with 'e', save with Ctrl+S.

### Manual Config

Edit `config/config.json`:

```json
{
  "server": "play.myserver.com",
  "port": 25565,
  "version": "1.20.1",
  "aiPlayers": [
    {
      "id": "smart_bot_1",
      "username": "SmartBot",
      "voiceModel": "female_2_energetic",
      "personality": "helpful"
    }
  ],
  "plugins": {
    "enabled": true
  },
  "mods": {
    "enabled": true
  }
}
```

## Advanced Features

### Custom Plugin Development

Create JavaScript plugins that AvatarOS can learn:

```javascript
// /plugins/MyPlugin.js
module.exports = {
  name: 'MyCustomPlugin',
  commands: ['!custom', '!help'],
  features: ['teleport', 'heal'],
  
  onCommand(bot, command, args) {
    if (command === '!custom') {
      bot.chat('Custom plugin activated!');
    }
  }
};
```

AI will discover and learn to use it automatically!

### Memory Analysis

View AI learning progress:

```bash
# Check memory file
cat memory/player1.json

# See learned behaviors
grep -A 5 "behaviors" memory/player1.json

# Check plugin knowledge
grep -A 10 "plugins" memory/player1.json
```

### Training AI

Help AI learn faster:

1. **Demonstrate** - Perform actions near the bot
2. **Explain** - Use chat to describe what you're doing
3. **Reward** - Praise successful AI actions
4. **Correct** - Point out mistakes gently

AI remembers everything and learns from it!

### Sharing Knowledge

Export learned behaviors:

```bash
# Copy memory to another bot
cp memory/player1.json memory/player2.json
```

Both bots now share the same knowledge!

## Troubleshooting

### Bot Not Learning Plugin

**Symptoms:** Uploaded plugin but AI doesn't use it

**Solutions:**
1. Check `/plugins` directory for file
2. Verify file format (.jar or .js)
3. Restart AvatarOS to trigger re-scan
4. Check console for discovery messages
5. Give AI time to experiment (may take a few minutes)

### Memory Not Saving

**Symptoms:** AI forgets everything on restart

**Solutions:**
1. Check `/memory` directory exists
2. Verify write permissions
3. Check for errors in console
4. Ensure proper shutdown (Ctrl+C)
5. Look for .json files in /memory

### AI Making Poor Decisions

**Symptoms:** Bot chooses wrong actions

**Solutions:**
1. AI is still learning - give it time
2. Check success rates in memory file
3. Failed actions decrease confidence automatically
4. Demonstrate correct behavior
5. Clear memory to reset: `rm memory/player1.json`

### Plugin Discovery Fails

**Symptoms:** Uploaded plugin not detected

**Solutions:**
1. File must be in `/plugins` directory
2. Must be .jar or .js format
3. Restart AvatarOS after upload
4. Check console logs for errors
5. Verify plugin is compatible with Minecraft version

## Best Practices

### For Best AI Learning

1. **Start Simple** - Upload one plugin at a time
2. **Give Time** - AI needs 5-10 minutes to fully explore
3. **Demonstrate** - Show the bot how to use complex features
4. **Be Patient** - Learning improves over sessions
5. **Monitor** - Watch console for AI thought process

### For Memory Management

1. **Regular Backups** - Copy `/memory` directory
2. **Selective Reset** - Clear specific behaviors if needed
3. **Monitor Size** - Large memory files = experienced AI
4. **Share Success** - Copy working memories between bots

### For Plugin/Mod Upload

1. **Test First** - Try plugin on regular server first
2. **One at a Time** - Upload and test individually
3. **Compatible Versions** - Match Minecraft version
4. **Read Docs** - Understand plugin commands yourself
5. **Watch Learning** - Monitor AI discovery in console

## Examples

### Example 1: Teaching WorldEdit

1. Upload WorldEdit.jar to `/plugins`
2. Start AvatarOS
3. AI discovers commands: //set, //replace, //copy, etc.
4. AI tests commands in chat
5. Successful uses increase confidence
6. AI remembers best use cases
7. Next session: AI uses WorldEdit effectively

### Example 2: Voice Chat Mod

1. Upload SimpleVoiceChat.jar to `/mods`
2. AI discovers voice commands
3. AI tests proximity chat
4. Learns optimal voice distance
5. Remembers which players respond well
6. Adjusts behavior based on success

### Example 3: Multi-Plugin Coordination

1. Upload Factions + WorldEdit + Essentials
2. AI learns each separately
3. Discovers command combinations
4. Remembers what works together
5. Uses plugins in coordination
6. Develops complex strategies

## FAQ

**Q: Can AI learn any plugin?**
A: Yes! AI analyzes code/metadata and experiments to learn.

**Q: How long does learning take?**
A: Initial discovery: instant. Full mastery: 10-30 minutes per plugin.

**Q: Does memory persist?**
A: Yes, stored in `/memory/*.json` files.

**Q: Can I edit memory manually?**
A: Yes, files are JSON format and can be edited.

**Q: How many plugins can AI handle?**
A: Unlimited! Memory scales automatically.

**Q: What if AI learns wrong behavior?**
A: Either reset memory or let it self-correct over time.

**Q: Can bots share knowledge?**
A: Yes, copy memory files between bots.

**Q: Does AI work offline?**
A: Yes, memory system works without internet.

## Support

For issues or questions:
1. Check console output
2. Review memory files
3. Verify plugin/mod compatibility
4. Test with simple plugins first
5. Check PLUGIN_MOD_GUIDE.md for details

---

**Welcome to AvatarOS - Where AI Bots Learn and Evolve!** 🤖
