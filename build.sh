#!/bin/bash
# Build script for Linux/Mac

echo "================================"
echo "Building Minecraft Pipeline Launcher"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "Building executable..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi

echo ""
echo "================================"
echo "Build completed successfully!"
echo "================================"
echo ""
echo "The executable is located in the dist folder."
echo "For Windows: dist/launcher.exe"
echo "For Linux: dist/launcher (if built with build:all)"
echo "For macOS: dist/launcher (if built with build:all)"
echo ""
