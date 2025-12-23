# AISMP - AI Streamer Multi-Platform Bot Orchestration System

A sophisticated bot orchestration system designed to manage multiple AI bots, assign them to streaming channels across different platforms, and handle defaults when resources are unavailable.

## Features

- **Multi-Platform Support**: Manage bots across Twitch, YouTube, Discord, Kick, and other platforms
- **Role-Based Assignment**: Support for solo and collaborative bot modes
- **Intelligent Routing**: Automatic bot assignment with priority-based routing
- **Fallback Handling**: Automatic fallback to backup bots when primary bots are unavailable
- **Schedule Management**: Time-based bot scheduling with timezone support
- **Capability Matching**: Ensure bots have required capabilities for each channel
- **YAML Configuration**: Easy-to-read configuration format

## Installation

```bash
npm install
```

## Quick Start

### 1. Configure Your Bots

Create or edit `config/bots.yaml`:

```yaml
bots:
  - id: bot_001
    name: "StreamBot Alpha"
    role: solo
    platforms:
      - twitch
      - youtube
    capabilities:
      - gaming
      - chat_moderation
    backup_bots:
      - bot_002

channels:
  - id: channel_001
    name: "Main Gaming Channel"
    platform: twitch
    preferred_bots:
      - bot_001
    requires_capabilities:
      - gaming
```

### 2. Use the Orchestrator

```javascript
import { loadConfigs, BotOrchestrator } from './src/index.js';

// Load configuration
const config = loadConfigs('config/bots.yaml');

// Create orchestrator
const orchestrator = new BotOrchestrator(config);

// Assign bot to channel
const result = orchestrator.assignBot('channel_001');
console.log(result.message);
```

## Configuration Reference

### Bot Configuration

```yaml
bots:
  - id: string              # Unique bot identifier
    name: string            # Human-readable bot name
    role: solo|collab       # Bot operation mode
    platforms: [string]     # Supported platforms
    priority: number        # Assignment priority (lower = higher priority)
    capabilities: [string]  # Bot capabilities
    backup_bots: [string]   # Fallback bot IDs
    schedule:               # Operating schedule
      timezone: string      # Timezone (e.g., "UTC", "America/New_York")
      active_hours:
        start: "HH:MM"      # Start time
        end: "HH:MM"        # End time
      days: [string]        # Active days (monday, tuesday, etc.)
```

### Channel Configuration

```yaml
channels:
  - id: string                    # Unique channel identifier
    name: string                  # Channel display name
    platform: string              # Platform (twitch, youtube, discord, etc.)
    preferred_bots: [string]      # Preferred bot IDs (in priority order)
    fallback_bots: [string]       # Fallback bot IDs
    requires_capabilities: [string] # Required bot capabilities
```

### Defaults

```yaml
defaults:
  fallback_strategy: round_robin|priority  # Fallback selection strategy
  max_retries: number                      # Maximum assignment retry attempts
  assignment_timeout: number               # Assignment timeout in seconds
  health_check_interval: number            # Health check interval in seconds
```

## API Documentation

### loadConfigs(source)

Load and parse bot configuration.

**Parameters:**
- `source` (string | object): Path to YAML file or configuration object

**Returns:** Normalized configuration object

**Example:**
```javascript
const config = loadConfigs('config/bots.yaml');
```

### loadFromEnv()

Load configuration from environment variables.

**Environment Variables:**
- `AISMP_CONFIG_PATH`: Path to configuration file (default: 'config/bots.yaml')

**Returns:** Normalized configuration object

### BotOrchestrator

Main orchestration class for managing bot assignments.

#### Constructor

```javascript
const orchestrator = new BotOrchestrator(config);
```

#### Methods

##### assignBot(channelId)

Assign a bot to a channel.

**Parameters:**
- `channelId` (string): Channel identifier

**Returns:** Assignment result object
```javascript
{
  success: boolean,
  channelId: string,
  botId: string,
  assignmentType: 'primary' | 'fallback' | 'backup',
  message: string
}
```

##### unassignBot(channelId)

Unassign a bot from a channel.

**Parameters:**
- `channelId` (string): Channel identifier

**Returns:** Unassignment result object

##### getAssignments()

Get all current bot-channel assignments.

**Returns:** Array of assignment objects

##### getBotStatus(botId)

Get status of a specific bot.

**Parameters:**
- `botId` (string): Bot identifier

**Returns:** Bot status object

##### setBotAvailability(botId, available)

Update bot availability status.

**Parameters:**
- `botId` (string): Bot identifier
- `available` (boolean): Availability status

##### getAvailableBots()

Get all available bots.

**Returns:** Array of available bot objects

## Bot Roles

### Solo Mode
- Bot can only be assigned to one channel at a time
- Ideal for resource-intensive tasks
- Automatically prevents double-booking

### Collab Mode
- Bot can be assigned to multiple channels simultaneously
- Perfect for lightweight moderation tasks
- Shared across multiple streams

## Assignment Logic

The orchestrator follows this priority order when assigning bots:

1. **Primary Bots**: Preferred bots with matching platform and capabilities
2. **Fallback Bots**: Secondary bots when primary bots are unavailable
3. **Backup Bots**: Configured backup bots from primary bot definitions
4. **Failure**: Returns failure if no suitable bot is found

### Assignment Criteria

A bot can be assigned if:
- ✓ Bot is available (not disabled)
- ✓ Bot supports the channel's platform
- ✓ Bot has all required capabilities
- ✓ Bot is within its scheduled operating hours
- ✓ Bot has capacity (solo bots: 0 active channels, collab bots: unlimited)

## Testing

Run the test suite:

```bash
npm test
```

Run the example:

```bash
node examples/usage.js
```

## Example Output

```
=== AISMP Bot Orchestration System - Example Usage ===

✓ Configuration loaded successfully
  - Bots: 3
  - Channels: 3
  - Routes: 3

--- Available Bots ---
  - StreamBot Alpha (bot_001)
    Role: solo
    Platforms: twitch, youtube
    Active Channels: 0

--- Assigning Bots to Channels ---
✓ Bot bot_001 assigned to channel channel_001 (primary)
  Assignment Type: primary
```

## Advanced Usage

### Environment-Based Configuration

```javascript
// Set environment variable
process.env.AISMP_CONFIG_PATH = 'config/production.yaml';

// Load from environment
const config = loadFromEnv();
```

### Dynamic Bot Management

```javascript
// Disable a bot temporarily
orchestrator.setBotAvailability('bot_001', false);

// Re-enable the bot
orchestrator.setBotAvailability('bot_001', true);

// Check bot status
const status = orchestrator.getBotStatus('bot_001');
console.log(status.activeChannels); // Array of assigned channel IDs
```

### Custom Capability Matching

```javascript
// Define custom capabilities in config
bots:
  - id: bot_advanced
    capabilities:
      - gaming
      - text_to_speech
      - music_playback
      - custom_alerts

channels:
  - id: premium_channel
    requires_capabilities:
      - gaming
      - text_to_speech
```

## Project Structure

```
pro/
├── src/
│   ├── index.js           # Main entry point
│   ├── config-loader.js   # Configuration loader and validator
│   └── orchestrator.js    # Bot orchestration logic
├── config/
│   └── bots.yaml         # Bot and channel configuration
├── tests/
│   ├── config-loader.test.js
│   └── orchestrator.test.js
├── examples/
│   └── usage.js          # Usage examples
├── package.json
└── README.md
```

## Contributing

This is a multi-bot Minecraft content pipeline project powered by Node.js. Feel free to extend the functionality for your specific use cases.

## License

ISC
