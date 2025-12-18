#!/bin/bash

# Setup script for Minecraft Bot Launcher

echo "🤖 Minecraft Bot Launcher - Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Create config files from examples if they don't exist
echo "📝 Setting up configuration files..."

if [ ! -f config/config.json ]; then
    cp config/config.example.json config/config.json
    echo "✅ Created config/config.json from example"
    echo "   ⚠️  Please edit config/config.json with your settings"
else
    echo "ℹ️  config/config.json already exists"
fi

if [ ! -f config/schedules.json ]; then
    cp config/schedules.example.json config/schedules.json
    echo "✅ Created config/schedules.json from example"
else
    echo "ℹ️  config/schedules.json already exists"
fi

echo ""
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📦 Installing iOS app dependencies..."
cd ios-app
npm install

if [ $? -eq 0 ]; then
    echo "✅ iOS app dependencies installed successfully"
else
    echo "❌ Failed to install iOS app dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit config/config.json with your Minecraft server and Twitch settings"
echo "2. Start the backend: npm start"
echo "3. In another terminal, start the iOS app: cd ios-app && npm start"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
