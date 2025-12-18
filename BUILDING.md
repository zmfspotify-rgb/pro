# Building and Using the Windows Executable

## Overview

This guide will help you build and use the Windows executable launcher for the Minecraft Content Pipeline Manager.

## Prerequisites for Building

- **Node.js 18 or later**: Download from [nodejs.org](https://nodejs.org/)
- **npm**: Comes bundled with Node.js

## Building the Executable

### Method 1: Using the Build Script (Recommended)

**On Windows:**
1. Double-click `build.bat`
2. The script will automatically install dependencies and build the executable
3. Wait for the build to complete (may take 2-3 minutes on first run)
4. The executable will be created at `dist/launcher.exe`

**On Linux/Mac:**
1. Open a terminal in the project directory
2. Run: `chmod +x build.sh` (first time only)
3. Run: `./build.sh`
4. The executable will be created at `dist/launcher.exe`

### Method 2: Using npm Commands

1. Open a terminal/command prompt in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the executable:
   ```bash
   npm run build
   ```
4. The executable will be created at `dist/launcher.exe`

## Using the Launcher

### Running the Application

**Option A: Using the Executable (Windows)**
1. Navigate to the `dist` folder
2. Double-click `launcher.exe`
3. The application will start in a command prompt window

**Option B: Using Node.js (Any Platform)**
1. Open a terminal in the project directory
2. Run: `npm start`

### Navigating the Application

The application uses an interactive menu system:

- **Arrow Keys (↑/↓)**: Move between menu options
- **Enter**: Select the highlighted option
- **Space**: Toggle checkboxes (in multi-select menus)

### Main Menu Features

#### ⚙️ Configure Settings
Edit all application settings through an interactive interface:

1. Select this option from the main menu
2. Choose which settings categories to edit (use Space to select, Enter to confirm)
3. Fill in the prompted values
4. Settings are automatically saved to `config/settings.json`

**Available Settings:**
- **Minecraft Server Settings**: Host, port, and version
- **Bot Configuration**: Number of bots, naming, and reconnection behavior
- **Content Pipeline Settings**: Output directory, format, and compression
- **General Settings**: Logging level and auto-start behavior

#### 🤖 Manage Bots
Configure and manage your Minecraft bots:
- View current bot configuration
- Add/remove bots (feature in development)
- List active bots (feature in development)

#### 📊 View Status
View current system status and all configuration values in JSON format.

#### 🚀 Start Pipeline
Start the content pipeline (feature in development).

#### 🛑 Stop Pipeline
Stop the content pipeline (feature in development).

#### ❌ Exit
Close the application gracefully.

## Configuration File

All settings are stored in `config/settings.json`. While you can edit this file directly with a text editor, it's recommended to use the application's built-in configuration menu to ensure proper formatting.

### Default Configuration

```json
{
  "minecraft": {
    "serverHost": "localhost",
    "serverPort": "25565",
    "version": "1.20.1"
  },
  "bots": {
    "maxBots": 5,
    "namePrefix": "Bot",
    "autoReconnect": true
  },
  "pipeline": {
    "outputDirectory": "./output",
    "format": "JSON",
    "compression": true
  },
  "general": {
    "logLevel": "info",
    "autoStart": false
  }
}
```

### Resetting Configuration

To reset to default settings:
1. Close the application if it's running
2. Delete `config/settings.json`
3. Restart the application - it will recreate the file with default values

## Distributing the Executable

The `launcher.exe` file is completely standalone and can be distributed to Windows users without requiring them to install Node.js or any other dependencies.

**To distribute:**
1. Copy `dist/launcher.exe` to your desired location
2. (Optional) Include the default `config/settings.default.json` for reference
3. Users can double-click the .exe to run the application

## Troubleshooting

### Build Issues

**Problem:** "Node.js is not installed"
- **Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

**Problem:** "Build failed" or "npm command not found"
- **Solution:** Ensure npm is installed (comes with Node.js) and is in your PATH

**Problem:** Build is very slow
- **Solution:** First build downloads Node.js binaries (~47MB) and may take a few minutes. Subsequent builds are faster.

### Runtime Issues

**Problem:** Settings aren't saving
- **Solution:** Ensure the application has write permission to the `config` directory

**Problem:** Executable won't start on Windows
- **Solution:** Check that Windows SmartScreen isn't blocking the file. Right-click the .exe, select Properties, and check "Unblock" if available.

**Problem:** "MODULE_NOT_FOUND" errors
- **Solution:** Rebuild the executable: `npm run build`

### Common Questions

**Q: Do users need Node.js installed to run the executable?**
A: No, the executable is standalone and includes everything needed.

**Q: Can I rename launcher.exe?**
A: Yes, you can rename it to anything you like.

**Q: How large is the executable?**
A: Approximately 47MB, as it includes the Node.js runtime and all dependencies.

**Q: Can I build executables for other platforms?**
A: Yes! Use `npm run build:all` to build for Windows, Linux, and macOS.

**Q: Where are logs stored?**
A: Currently, all output goes to the console. File logging can be added in future versions.

## Next Steps

1. Build the executable
2. Configure your Minecraft server settings
3. Set up your bot preferences
4. Configure pipeline output settings
5. Start using the application!

For more information, see the main [README.md](README.md).
