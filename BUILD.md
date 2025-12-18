# Build Instructions

## Building on Windows

If you're on a Windows machine, you can build the installer directly:

```bash
npm install
npm run build
```

This will create a Windows installer in the `dist/` folder.

## Building on Linux/Mac

Due to platform limitations, you can only build the unpacked version on Linux/Mac:

```bash
npm install
npm run build:dir
```

This creates an unpacked version in `dist/win-unpacked/` that can be copied to a Windows machine and run directly.

### Option 1: Using Wine (Advanced)

Install Wine and run the full build:
```bash
sudo apt-get install wine wine64
npm run build
```

### Option 2: Transfer to Windows

1. Copy the entire `dist/win-unpacked/` folder to a Windows machine
2. Run `Minecraft Bot Manager Pro.exe`
3. (Optional) Create a shortcut to the exe file

## Build Output

- **Unpacked build**: `dist/win-unpacked/Minecraft Bot Manager Pro.exe`
- **Installer build**: `dist/Minecraft Bot Manager Pro Setup.exe` (Windows only)

## What's Included

The built application includes:
- Main executable
- All dependencies bundled
- UI assets
- Bot management system
- Scheduling system
- All features from the main application

## Testing the Build

On Windows, you can run the executable directly:
```
cd dist/win-unpacked
"Minecraft Bot Manager Pro.exe"
```

## Distribution

The unpacked folder can be:
1. Zipped and distributed
2. Used to create a portable version
3. Installed on multiple machines

For proper installation, build on Windows to get the installer.
