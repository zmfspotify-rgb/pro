# Troubleshooting Guide

Common issues and their solutions for the Minecraft Bot Launcher system.

## Installation Issues

### "npm install" fails

**Problem**: Dependencies fail to install
**Solutions**:
1. Update Node.js to latest LTS version
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`, then retry
4. Check internet connection
5. Try using npm registry: `npm config set registry https://registry.npmjs.org/`

### Setup script fails

**Problem**: `./setup.sh` encounters errors
**Solutions**:
1. Make it executable: `chmod +x setup.sh`
2. Run with bash: `bash setup.sh`
3. On Windows, use Git Bash or WSL
4. Check Node.js and npm are installed

## Backend Issues

### Server won't start

**Problem**: `npm start` fails or crashes
**Solutions**:
1. Check port 3000 isn't already in use: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)
2. Verify all dependencies installed: `npm install`
3. Check config files exist: `config/config.json` and `config/schedules.json`
4. Review error messages in console
5. Try different port: `PORT=3001 npm start`

### Bot won't connect to Minecraft server

**Problem**: Bot fails to connect or gets kicked
**Solutions**:
1. Verify server IP and port in config.json
2. Check Minecraft server is online
3. Ensure server version matches bot version
4. For online mode servers, use valid credentials
5. Check firewall isn't blocking connection
6. Verify bot username isn't already in use

### Streaming fails to start

**Problem**: Can't start Twitch streaming
**Solutions**:
1. Verify Twitch stream key is correct
2. Check OAuth token is valid and includes `oauth:` prefix
3. Install FFmpeg: `brew install ffmpeg` (Mac) or download from ffmpeg.org
4. Verify channel name matches your Twitch channel
5. Check internet upload speed is sufficient
6. Review FFmpeg errors in console

## iOS App Issues

### Can't connect to backend

**Problem**: App shows "Disconnected" status
**Solutions**:
1. Verify backend is running: Check `http://YOUR_IP:3000/health` in browser
2. Correct server URL in Settings (include `http://` and port)
3. On same WiFi network for local testing
4. Disable VPN if active
5. Check firewall isn't blocking port 3000
6. For HTTPS, ensure valid SSL certificate

### App crashes on launch

**Problem**: App closes immediately after opening
**Solutions**:
1. Clear Expo cache: Delete `.expo` folder
2. Reinstall dependencies: `cd ios-app && rm -rf node_modules && npm install`
3. Check Expo version compatibility
4. Review logs in Expo developer tools
5. Try on different device/simulator
6. Update Expo SDK: `expo upgrade`

### Can't build IPA

**Problem**: `eas build` fails
**Solutions**:
1. Login to Expo: `eas login`
2. Configure properly: `eas build:configure`
3. Update app.json with valid bundle identifier
4. Replace placeholder project ID in app.json
5. Ensure Apple Developer account is active
6. Check build logs for specific errors
7. Try: `eas build --clear-cache`

## Bot Behavior Issues

### Bot just stands still

**Problem**: Bot connects but doesn't do anything
**Solutions**:
1. Check current task: View in app or API
2. Assign a task via schedule or manual command
3. Verify bot has necessary resources (tools, food)
4. Check for errors in backend console
5. Ensure pathfinder plugin loaded correctly

### Bot keeps dying

**Problem**: Bot frequently dies in-game
**Solutions**:
1. Enable automatic healing in bot code
2. Avoid dangerous areas in exploration tasks
3. Ensure bot has food in inventory
4. Reduce aggressive mob encounters
5. Adjust task difficulty

### Chat responses don't work

**Problem**: Bot doesn't respond to Twitch chat
**Solutions**:
1. Verify streaming is active
2. Check Twitch OAuth token is valid
3. Ensure channel name is correct
4. Review chat connection in logs
5. Check response patterns in twitch-chat-responder.js
6. Adjust engagement probability in config

## Schedule Issues

### Scheduled streams don't start

**Problem**: Bots don't stream at scheduled times
**Solutions**:
1. Verify cron expression syntax
2. Check server timezone matches expectation
3. Ensure schedule manager is running (starts with server)
4. Review logs for schedule execution errors
5. Verify bot ID matches in schedule and config
6. Check backend is running when schedule triggers

### Wrong timezone for schedules

**Problem**: Schedules run at unexpected times
**Solutions**:
1. Server uses system timezone
2. Adjust cron expressions for timezone offset
3. Or change server timezone: `export TZ=America/New_York`
4. Consider using UTC for consistency

## Configuration Issues

### Config changes don't apply

**Problem**: Edited config isn't being used
**Solutions**:
1. Restart backend server after config changes
2. Verify JSON syntax is valid (use JSON validator)
3. Check file saved properly
4. Clear any cached config
5. Review logs for config loading errors

### Lost config after update

**Problem**: Config reset or disappeared
**Solutions**:
1. Check git status - config.json in .gitignore
2. Restore from config.example.json
3. Check for backup files
4. Recreate from documentation

## Performance Issues

### High CPU usage

**Problem**: Server or bot uses too much CPU
**Solutions**:
1. Limit number of concurrent bots
2. Reduce task complexity
3. Increase task execution intervals
4. Disable streaming if not needed
5. Optimize pathfinding radius

### High memory usage

**Problem**: Running out of memory
**Solutions**:
1. Restart backend periodically
2. Limit conversation history size
3. Reduce number of active bots
4. Clear logs regularly
5. Use process manager with memory limits

### Slow response times

**Problem**: API requests are slow
**Solutions**:
1. Check server resources
2. Optimize bot tasks
3. Reduce polling frequency in app
4. Consider upgrading server hardware
5. Use local network instead of internet

## Network Issues

### Can't access from phone

**Problem**: iPhone can't reach backend
**Solutions**:
1. Use computer's local IP, not localhost
2. Find IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. Ensure both on same network
4. Check firewall allows incoming on port 3000
5. For remote access, use ngrok or cloud hosting

### Connection drops frequently

**Problem**: App loses connection to backend
**Solutions**:
1. Use stable WiFi connection
2. Consider cloud hosting for backend
3. Implement reconnection logic
4. Check for network interference
5. Use wired connection for server

## Development Issues

### Hot reload not working

**Problem**: Changes don't appear in app
**Solutions**:
1. Save file completely
2. Shake device and reload manually
3. Restart Expo dev server
4. Clear Metro bundler cache
5. Check for syntax errors

### Linter errors

**Problem**: Code style warnings
**Solutions**:
1. Install recommended extensions
2. Run `npm run lint` if available
3. Follow existing code style
4. Use Prettier for formatting

## Platform-Specific Issues

### Windows

**Screen capture for streaming**:
- Requires gdigrab (included in FFmpeg)
- May need admin rights
- Check display settings

### macOS

**Screen recording permissions**:
- Grant screen recording permission
- System Preferences > Security & Privacy > Screen Recording
- Add Terminal or Node

### Linux

**X11 capture**:
- Install x11grab
- May need display permissions
- Check DISPLAY variable

## Getting Help

### Still having issues?

1. **Check logs**: Backend console shows detailed errors
2. **Search issues**: Check GitHub issues for similar problems
3. **Review docs**: README, API docs, QUICKSTART
4. **Test components**:
   - Backend: `curl http://localhost:3000/health`
   - Config: Validate JSON syntax
   - Network: Ping server from phone
5. **Ask for help**: Open GitHub issue with:
   - Error messages
   - Steps to reproduce
   - System info (OS, Node version, etc.)
   - Config (remove sensitive data)

### Debug Mode

Enable verbose logging:
```bash
# Backend
DEBUG=* npm start

# iOS app
Check Expo developer tools console
```

### Common Commands for Debugging

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Test backend health
curl http://localhost:3000/health

# View running processes
ps aux | grep node

# Check port usage
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Test Minecraft connection
telnet minecraft-server.com 25565

# Validate JSON
cat config/config.json | python -m json.tool
```

## Best Practices

To avoid issues:
1. ✅ Keep Node.js updated
2. ✅ Use example configs as templates
3. ✅ Test backend before iOS app
4. ✅ Validate JSON before saving
5. ✅ Backup config before changes
6. ✅ Check logs regularly
7. ✅ Start with one bot, then scale
8. ✅ Use stable WiFi for mobile app
9. ✅ Keep documentation handy
10. ✅ Update dependencies regularly
