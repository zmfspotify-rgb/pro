# Minecraft Bot Pipeline - iOS App

This iOS app provides a mobile interface for managing the Minecraft Bot Pipeline system.

## Features

- 🤖 **Bot Creation** - Create and configure Minecraft bots
- 🎤 **16 Voice Presets** - Select from 8 male and 8 female voice models
- ⏰ **24/7 AI Player** - Start/stop the server keeper bot
- ⚙️ **Server Configuration** - Configure Minecraft server settings
- 📊 **Status Monitoring** - Real-time bot status display

## Building the .ipa for Signulous

### Requirements
- macOS with Xcode installed
- Valid iOS Developer Certificate
- Signulous app on your iOS device

### Build Steps

1. **Prepare the Build**
   ```bash
   npm run build:ios
   ```

2. **Open in Xcode**
   - Open `ios/MinecraftBotPipeline.xcodeproj` in Xcode
   - Select your development team in project settings
   - Configure code signing

3. **Archive the App**
   - Product > Archive
   - Wait for archive to complete

4. **Export .ipa**
   - Window > Organizer
   - Select the archive
   - Click "Distribute App"
   - Choose "Development" or "Ad Hoc"
   - Export the .ipa file

5. **Install via Signulous**
   - Transfer .ipa to iOS device
   - Open Signulous app
   - Import and install the .ipa

See `../build/IPA_INSTALLATION_GUIDE.md` for detailed installation instructions.

## App Structure

- **AppDelegate.swift** - App lifecycle management
- **ViewController.swift** - Main UI and bot controls
- **Info.plist** - App configuration

## Screenshots

The app includes:
- Voice preset selector showing all 16 options
- Bot creation interface
- 24/7 AI player controls
- Feature list display

## Notes

- The app requires a running Minecraft server to connect
- Bots are created on the server, not on the iOS device
- The app serves as a control interface for the Node.js backend
- For full functionality, run the Node.js backend (see main README.md)
