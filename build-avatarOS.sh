#!/bin/bash

# AvatarOS Build Script
# This script builds AvatarOS.exe with ALL features included
# Works on Linux, macOS, and Git Bash on Windows

set -e  # Exit on error

echo "=========================================="
echo "  AvatarOS Build Script"
echo "  Building with ALL features included"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed!"
    echo "   Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1/3: Installing dependencies..."
echo "   This may take a few minutes on first run..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Step 2: Build AvatarOS.exe
echo "🔨 Step 2/3: Building AvatarOS.exe..."
echo "   This will create a standalone executable with all features"
echo "   Please wait, this may take 2-5 minutes..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Step 3: Verify the build
echo "🔍 Step 3/3: Verifying build..."
if [ -f "dist/AvatarOS.exe" ]; then
    FILE_SIZE=$(du -h "dist/AvatarOS.exe" | cut -f1)
    echo "✅ AvatarOS.exe created successfully!"
    echo "   Location: dist/AvatarOS.exe"
    echo "   Size: $FILE_SIZE"
    echo ""
    echo "=========================================="
    echo "  ✨ BUILD SUCCESSFUL! ✨"
    echo "=========================================="
    echo ""
    echo "📋 What's included in AvatarOS.exe:"
    echo "   ✅ AI Memory System"
    echo "   ✅ Dynamic Plugin/Mod Learning"
    echo "   ✅ Twitch Streaming Integration"
    echo "   ✅ 16 Voice Models (8 female, 8 male)"
    echo "   ✅ In-Launcher Config Editor"
    echo "   ✅ Unlimited AI Players"
    echo "   ✅ Lifesteal SMP Plugin Support"
    echo "   ✅ Simple Voice Chat Mod Support"
    echo "   ✅ Auto-Reconnect"
    echo "   ✅ Smart Scheduling"
    echo "   ✅ Everything you requested!"
    echo ""
    echo "🚀 How to use:"
    echo "   1. Run: ./dist/AvatarOS.exe"
    echo "   2. Config editor: ./dist/AvatarOS.exe --config"
    echo "   3. Upload plugins/mods to /plugins and /mods folders"
    echo "   4. AI will automatically learn to use them!"
    echo ""
    echo "📖 Documentation:"
    echo "   - README.md - Complete documentation"
    echo "   - AVATARSOS_GUIDE.md - User guide"
    echo "   - SETUP_GUIDE.md - Setup instructions"
    echo "   - PLUGIN_MOD_GUIDE.md - Plugin/Mod documentation"
    echo ""
    echo "✅ Ready to use! No additional installation needed!"
    echo "=========================================="
else
    echo "❌ Error: AvatarOS.exe was not created"
    echo "   Please check the error messages above"
    exit 1
fi
