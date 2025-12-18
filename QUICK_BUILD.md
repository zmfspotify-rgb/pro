# Quick Build Guide for AvatarOS.exe

## 🚀 FASTEST WAY TO BUILD - Just Run One File!

We've created easy build scripts that do everything for you automatically!

### For Windows Users:

**Option 1: Double-click the file**
1. Double-click `build-avatarOS.bat`
2. Wait 2-5 minutes
3. Done! AvatarOS.exe will be in the `dist` folder

**Option 2: Command Prompt**
```cmd
build-avatarOS.bat
```

### For Linux/Mac/Git Bash Users:

```bash
./build-avatarOS.sh
```

Or if you get a permission error:
```bash
chmod +x build-avatarOS.sh
./build-avatarOS.sh
```

## ✅ What the Script Does

The build script automatically:
1. ✅ Checks that Node.js and npm are installed
2. ✅ Installs all dependencies (`npm install`)
3. ✅ Builds AvatarOS.exe with ALL features (`npm run build`)
4. ✅ Verifies the build was successful
5. ✅ Shows you where to find AvatarOS.exe

## 📦 What's Included in AvatarOS.exe

**Everything you requested:**
- ✅ AI Memory System (short-term & long-term)
- ✅ Dynamic Plugin/Mod Learning
- ✅ Twitch Streaming (no OBS needed)
- ✅ 16 Voice Models (8 female, 8 male)
- ✅ In-Launcher Config Editor
- ✅ Unlimited AI Players
- ✅ Lifesteal SMP Plugin Support
- ✅ Simple Voice Chat Mod Support
- ✅ Auto-Reconnect
- ✅ Smart Scheduling
- ✅ Game Commentary
- ✅ Chat Interaction

**NO MANUAL INSTALLATION NEEDED!** Everything is built into the .exe file!

## ⚡ Requirements

Before running the build script, make sure you have:
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To check if you have them:
```bash
node --version
npm --version
```

## 🎯 After Building

Once the build completes, you'll find:
- **AvatarOS.exe** in the `dist` folder (~426MB)

### How to Use:
```bash
# Run AvatarOS
./dist/AvatarOS.exe

# Open config editor
./dist/AvatarOS.exe --config
```

### Upload Plugins/Mods:
1. Drop plugin files (.jar or .js) into `/plugins` folder
2. Drop mod files (.jar or .js) into `/mods` folder
3. Run AvatarOS - AI automatically learns to use them!

## 🆘 Troubleshooting

### "Node.js is not installed"
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt
- Try the build script again

### "npm install failed"
- Make sure you have internet connection
- Try running `npm cache clean --force`
- Run the build script again

### "Build failed"
- Delete the `node_modules` folder
- Delete `package-lock.json`
- Run the build script again

### Build is slow
- First build takes 2-5 minutes (downloads dependencies)
- Subsequent builds are faster (~1-2 minutes)

## 📖 Documentation

After building, check out:
- `README.md` - Complete feature documentation
- `AVATARSOS_GUIDE.md` - Detailed user guide (9,500+ chars)
- `SETUP_GUIDE.md` - Twitch, voice, and streaming setup
- `PLUGIN_MOD_GUIDE.md` - How to use plugins and mods
- `BUILD.md` - Developer build information

## 🎉 You're Ready!

Once the build script completes successfully, you have:
- ✅ AvatarOS.exe with ALL features built-in
- ✅ No additional installation needed
- ✅ Ready to run immediately
- ✅ Can upload unlimited plugins/mods
- ✅ AI automatically learns everything

**Just run the build script and you'll be ready before tonight!**

---

**Need help?** Check the documentation or open an issue on GitHub.
