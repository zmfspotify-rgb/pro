# Build Instructions

This document explains how to build the Windows launcher executable.

## Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)

## Building the Launcher

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the Windows executable:
   ```bash
   npm run build
   ```

   This will create `launcher.exe` in the `dist/` directory.

3. (Optional) Build for all platforms:
   ```bash
   npm run build:all
   ```

   This will create executables for Windows, Linux, and macOS in the `dist/` directory.

## Testing the Executable

After building, you can test the launcher:

```bash
# On Windows
dist\launcher.exe

# Or run directly with Node.js
npm start
```

## Distribution

The `launcher.exe` file in the `dist/` directory is a standalone executable that includes:
- Node.js runtime
- All application code
- Configuration files

Users can download and run `launcher.exe` without installing Node.js.

## File Size

The executable is approximately 36-40 MB because it includes the Node.js runtime.
This is normal for standalone Node.js executables created with pkg.
