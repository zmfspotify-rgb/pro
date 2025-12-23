# pro - AISMP Bot Orchestration System

A multi-bot Minecraft content pipeline project powered by Node.js

## Overview

AISMP (AI Streamer Multi-Platform) is a sophisticated bot orchestration system that manages multiple AI bots across various streaming platforms. It intelligently assigns bots to channels based on platform requirements, bot capabilities, schedules, and availability.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run example
node examples/usage.js
```

## Features

- ✅ **Multi-Platform Support**: Manage bots across Twitch, YouTube, Discord, and more
- ✅ **Role-Based Assignment**: Solo and collaborative bot modes
- ✅ **Smart Routing**: Priority-based bot assignment with automatic fallbacks
- ✅ **Schedule Management**: Time-based bot scheduling with timezone support
- ✅ **YAML Configuration**: Easy-to-read configuration files

## Documentation

For detailed documentation, see [docs/README.md](docs/README.md)

## Project Structure

```
pro/
├── src/               # Source code
├── config/            # YAML configuration files
├── tests/             # Test suite
├── examples/          # Usage examples
└── docs/              # Documentation
```

## License

ISC
