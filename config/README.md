# Configuration Files

This directory contains configuration files for the bot system.

## config.json

Main configuration file containing:
- List of bot IDs
- Minecraft server settings
- Twitch configuration
- Voice/TTS settings
- Individual bot configurations

## schedules.json

Schedule configuration for each bot containing:
- `streaming`: Array of streaming time slots with cron expressions
- `activities`: Array of automated tasks with cron expressions

### Cron Expression Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

Examples:
- `0 14 * * *` - Every day at 2:00 PM
- `0 */2 * * *` - Every 2 hours
- `0 9-17 * * 1-5` - Every hour from 9 AM to 5 PM, Monday to Friday
