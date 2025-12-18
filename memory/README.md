# AI Memory Storage

This directory contains the memory files for each AI player in AvatarOS.

## How It Works

Each AI player has their own memory file (e.g., `player1.json`) that stores:

- **Short-term Memory**: Recent events (last 100)
- **Long-term Memory**: Important experiences (last 1000)
- **Learned Behaviors**: Actions and their success rates
- **Plugin Knowledge**: Discovered plugins and how to use them
- **Mod Knowledge**: Discovered mods and how to use them
- **Player Interactions**: History with other players

## Memory Structure

```json
{
  "longTerm": [...],
  "behaviors": {...},
  "plugins": {...},
  "mods": {...},
  "interactions": {...}
}
```

## AI Learning Process

1. **Experience**: AI encounters new situation
2. **Remember**: Event stored in short-term memory
3. **Analyze**: AI determines importance
4. **Commit**: Important events move to long-term memory
5. **Learn**: Patterns extracted and stored as behaviors
6. **Recall**: Future decisions use past experiences

## Features

- **Automatic thinking**: AI considers past experiences when making decisions
- **Continuous learning**: Success rates improve over time
- **Persistent memory**: Learning survives restarts
- **Individual learning**: Each AI develops unique experiences
- **Smart decisions**: Higher success rate behaviors preferred

## Notes

- Memory files are JSON format
- Automatically created on first use
- Can be manually edited if needed
- Larger memory files = more experienced AI
- Memory can be cleared via commands
