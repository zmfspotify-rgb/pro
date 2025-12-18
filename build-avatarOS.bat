@echo off
REM AvatarOS Build Script for Windows
REM This script builds AvatarOS.exe with ALL features included

REM Change to the directory where the script is located
cd /d "%~dp0"

echo ==========================================
echo   AvatarOS Build Script
echo   Building with ALL features included
echo ==========================================
echo.
echo Current directory: %CD%
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Node.js is not installed!
    echo ========================================
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer
    echo After installation, restart this script
    echo.
    echo Press any key to open Node.js download page...
    pause >nul
    start https://nodejs.org/
    echo.
    echo After installing Node.js, press any key to exit...
    pause
    exit /b 1
)

REM Check if npm is installed
echo Checking for npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: npm is not installed!
    echo ========================================
    echo.
    echo npm usually comes with Node.js
    echo Please reinstall Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Node.js detected
node --version
echo ✓ npm detected
npm --version
echo.
echo ✓ All prerequisites met!
echo.

REM Step 1: Install dependencies
echo ==========================================
echo 📦 Step 1/3: Installing dependencies
echo ==========================================
echo This may take a few minutes on first run...
echo Please be patient, do not close this window
echo.
call npm install

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Failed to install dependencies
    echo ========================================
    echo.
    echo This could be due to:
    echo - Network connection issues
    echo - npm registry problems
    echo - Permission issues
    echo.
    echo Try running this script as Administrator
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully
echo.

REM Step 2: Build AvatarOS.exe
echo ==========================================
echo 🔨 Step 2/3: Building AvatarOS.exe
echo ==========================================
echo Creating standalone executable with all features...
echo This will take 2-5 minutes, please wait...
echo DO NOT CLOSE THIS WINDOW
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Build failed
    echo ========================================
    echo.
    echo Please check the error messages above
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Build completed successfully
echo.

REM Step 3: Verify the build
echo ==========================================
echo 🔍 Step 3/3: Verifying build
echo ==========================================
echo.
if exist "dist\AvatarOS.exe" (
    echo ✓ AvatarOS.exe created successfully!
    echo.
    echo Location: %CD%\dist\AvatarOS.exe
    for %%A in ("dist\AvatarOS.exe") do echo Size: %%~zA bytes
    echo.
    echo ==========================================
    echo   ✨ BUILD SUCCESSFUL! ✨
    echo ==========================================
    echo.
    echo 📋 What's included in AvatarOS.exe:
    echo    ✓ AI Memory System
    echo    ✓ Dynamic Plugin/Mod Learning
    echo    ✓ Twitch Streaming Integration
    echo    ✓ 16 Voice Models (8 female, 8 male)
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
    echo.
    echo ========================================
    echo ERROR: AvatarOS.exe was not created
    echo ========================================
    echo.
    echo The build process completed but the file was not found.
    echo Please check the error messages above.
    echo.
    echo Expected location: %CD%\dist\AvatarOS.exe
    echo.
    pause
    exit /b 1
)

echo.
echo Press any key to exit...
pause
