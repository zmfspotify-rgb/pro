@echo off
REM AvatarOS Build Script for Windows
REM This script builds AvatarOS.exe with ALL features included

echo ==========================================
echo   AvatarOS Build Script
echo   Building with ALL features included
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed!
    echo Please install npm usually comes with Node.js
    pause
    exit /b 1
)

echo ✓ Node.js version:
node --version
echo ✓ npm version:
npm --version
echo.

REM Step 1: Install dependencies
echo 📦 Step 1/3: Installing dependencies...
echo    This may take a few minutes on first run...
call npm install

if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo ✓ Dependencies installed successfully
echo.

REM Step 2: Build AvatarOS.exe
echo 🔨 Step 2/3: Building AvatarOS.exe...
echo    This will create a standalone executable with all features
echo    Please wait, this may take 2-5 minutes...
call npm run build

if errorlevel 1 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo ✓ Build completed successfully
echo.

REM Step 3: Verify the build
echo 🔍 Step 3/3: Verifying build...
if exist "dist\AvatarOS.exe" (
    echo ✓ AvatarOS.exe created successfully!
    echo    Location: dist\AvatarOS.exe
    for %%A in ("dist\AvatarOS.exe") do echo    Size: %%~zA bytes
    echo.
    echo ==========================================
    echo   ✨ BUILD SUCCESSFUL! ✨
    echo ==========================================
    echo.
    echo 📋 What's included in AvatarOS.exe:
    echo    ✓ AI Memory System
    echo    ✓ Dynamic Plugin/Mod Learning
    echo    ✓ Twitch Streaming Integration
    echo    ✓ 16 Voice Models 8 female, 8 male
    echo    ✓ In-Launcher Config Editor
    echo    ✓ Unlimited AI Players
    echo    ✓ Lifesteal SMP Plugin Support
    echo    ✓ Simple Voice Chat Mod Support
    echo    ✓ Auto-Reconnect
    echo    ✓ Smart Scheduling
    echo    ✓ Everything you requested!
    echo.
    echo 🚀 How to use:
    echo    1. Run: dist\AvatarOS.exe
    echo    2. Config editor: dist\AvatarOS.exe --config
    echo    3. Upload plugins/mods to \plugins and \mods folders
    echo    4. AI will automatically learn to use them!
    echo.
    echo 📖 Documentation:
    echo    - README.md - Complete documentation
    echo    - AVATARSOS_GUIDE.md - User guide
    echo    - SETUP_GUIDE.md - Setup instructions
    echo    - PLUGIN_MOD_GUIDE.md - Plugin/Mod documentation
    echo.
    echo ✓ Ready to use! No additional installation needed!
    echo ==========================================
) else (
    echo Error: AvatarOS.exe was not created
    echo Please check the error messages above
    pause
    exit /b 1
)

pause
