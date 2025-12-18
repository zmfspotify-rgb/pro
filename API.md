# API Reference

Complete reference for the Minecraft Bot Launcher API.

## Base URL

```
http://localhost:3000
```

For production, replace with your deployed URL.

## Endpoints

### Health Check

#### GET /health

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-12-18T17:30:00.000Z"
}
```

---

### Bot Management

#### GET /api/bots

Get a list of all configured bots with their status.

**Response:**
```json
{
  "bots": [
    {
      "id": "bot1",
      "running": true,
      "streaming": false,
      "connected": true,
      "currentTask": {
        "type": "mine",
        "blockType": "stone"
      },
      "config": {
        "minecraft": {
          "host": "localhost",
          "port": 25565,
          "username": "bot1",
          "version": "1.19",
          "auth": "offline"
        },
        "twitch": {
          "channel": "channel_name",
          "streamKey": "...",
          "oauth": "..."
        },
        "voice": {
          "enabled": true,
          "model": "male1"
        }
      }
    }
  ]
}
```

#### POST /api/bots/start

Start a bot.

**Request Body:**
```json
{
  "botId": "bot1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bot bot1 started"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Bot bot1 is already running"
}
```

#### POST /api/bots/stop

Stop a running bot.

**Request Body:**
```json
{
  "botId": "bot1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bot bot1 stopped"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Bot bot1 is not running"
}
```

#### GET /api/bots/:botId/status

Get detailed status for a specific bot.

**Parameters:**
- `botId` (path) - The bot identifier

**Response:**
```json
{
  "botId": "bot1",
  "status": {
    "running": true,
    "streaming": false,
    "connected": true,
    "currentTask": {
      "type": "explore",
      "radius": 100
    }
  }
}
```

---

### Streaming Control

#### POST /api/bots/:botId/stream/start

Start streaming for a bot.

**Parameters:**
- `botId` (path) - The bot identifier

**Response:**
```json
{
  "success": true,
  "message": "Streaming started for bot bot1"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Bot bot1 is not running"
}
```

#### POST /api/bots/:botId/stream/stop

Stop streaming for a bot.

**Parameters:**
- `botId` (path) - The bot identifier

**Response:**
```json
{
  "success": true,
  "message": "Streaming stopped for bot bot1"
}
```

---

### Configuration Management

#### GET /api/config

Get the current configuration.

**Response:**
```json
{
  "bots": ["bot1", "bot2"],
  "minecraft": {
    "host": "localhost",
    "port": 25565,
    "version": "1.19",
    "auth": "offline"
  },
  "twitch": {
    "channel": "your_channel",
    "streamKey": "...",
    "oauth": "..."
  },
  "voice": {
    "enabled": true,
    "model": "default"
  },
  "botConfigs": {
    "bot1": {
      "minecraft": {
        "username": "bot1"
      },
      "voice": {
        "model": "male1"
      }
    }
  }
}
```

#### POST /api/config

Update the configuration.

**Request Body:**
```json
{
  "minecraft": {
    "host": "server.example.com",
    "port": 25565
  },
  "twitch": {
    "channel": "my_channel"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration updated"
}
```

**Note:** The request body is merged with existing configuration. Only include fields you want to update.

---

### Schedule Management

#### GET /api/schedule

Get all bot schedules.

**Response:**
```json
{
  "schedule": {
    "bot1": {
      "streaming": [
        {
          "cronExpression": "0 14 * * *",
          "duration": 120
        }
      ],
      "activities": [
        {
          "cronExpression": "0 10 * * *",
          "task": {
            "type": "mine",
            "blockType": "diamond_ore",
            "count": 10
          }
        }
      ]
    }
  }
}
```

#### POST /api/schedule

Update a bot's schedule.

**Request Body:**
```json
{
  "botId": "bot1",
  "schedule": {
    "streaming": [
      {
        "cronExpression": "0 14 * * *",
        "duration": 120
      },
      {
        "cronExpression": "0 20 * * *",
        "duration": 180
      }
    ],
    "activities": [
      {
        "cronExpression": "0 12 * * *",
        "task": {
          "type": "explore",
          "radius": 50
        }
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Schedule updated"
}
```

#### DELETE /api/schedule/:botId

Delete a bot's schedule.

**Parameters:**
- `botId` (path) - The bot identifier

**Response:**
```json
{
  "success": true,
  "message": "Schedule removed"
}
```

---

## Task Types

When scheduling activities or executing tasks, use these task types:

### Mine Task
```json
{
  "type": "mine",
  "blockType": "diamond_ore",
  "count": 10
}
```

### Build Task
```json
{
  "type": "build",
  "structure": {
    "name": "house",
    "blocks": [
      {
        "type": "stone",
        "position": {"x": 0, "y": 0, "z": 0}
      }
    ]
  }
}
```

### Explore Task
```json
{
  "type": "explore",
  "radius": 100
}
```

### Collect Task
```json
{
  "type": "collect",
  "items": ["wheat", "carrot", "potato"]
}
```

### Hunt Task
```json
{
  "type": "hunt",
  "mobType": "zombie",
  "count": 5
}
```

### Farm Task
```json
{
  "type": "farm",
  "cropType": "wheat"
}
```

### Heal Task
```json
{
  "type": "heal"
}
```

### Craft Task
```json
{
  "type": "craft",
  "item": "stone_pickaxe",
  "count": 1
}
```

### Follow Task
```json
{
  "type": "follow",
  "player": "PlayerName"
}
```

---

## Cron Expression Format

Schedules use cron expressions with the following format:

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Examples:

- `0 14 * * *` - Every day at 2:00 PM
- `30 9 * * 1-5` - 9:30 AM, Monday to Friday
- `0 */2 * * *` - Every 2 hours
- `0 9-17 * * *` - Every hour from 9 AM to 5 PM
- `*/15 * * * *` - Every 15 minutes
- `0 0 * * 0` - Every Sunday at midnight
- `0 12 1 * *` - 12:00 PM on the 1st of every month

---

## Error Codes

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Check server health:
```bash
curl http://localhost:3000/health
```

### Get all bots:
```bash
curl http://localhost:3000/api/bots
```

### Start a bot:
```bash
curl -X POST http://localhost:3000/api/bots/start \
  -H "Content-Type: application/json" \
  -d '{"botId":"bot1"}'
```

### Get bot status:
```bash
curl http://localhost:3000/api/bots/bot1/status
```

### Start streaming:
```bash
curl -X POST http://localhost:3000/api/bots/bot1/stream/start
```

### Update schedule:
```bash
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "botId": "bot1",
    "schedule": {
      "streaming": [
        {
          "cronExpression": "0 14 * * *",
          "duration": 120
        }
      ]
    }
  }'
```

---

## Rate Limiting

Currently, there are no rate limits. For production deployment, consider implementing rate limiting to prevent abuse.

## Authentication

The current version does not include authentication. For production deployment, implement:
- API key authentication
- OAuth 2.0
- JWT tokens

## CORS

CORS is enabled for all origins. For production, configure specific allowed origins in `backend/server.js`.
