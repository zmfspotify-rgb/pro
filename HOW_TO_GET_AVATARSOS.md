# How to Get AvatarOS.exe

## ⚠️ Important: Why AvatarOS.exe is Not in the Repository

The AvatarOS.exe file is **426MB+** which exceeds GitHub's 100MB file size limit. Therefore, it cannot be stored directly in the repository.

## 🎯 Three Ways to Get AvatarOS.exe

### Option 1: Download from GitHub Releases (EASIEST)

**This is the recommended method for most users.**

1. Go to the [Releases page](../../releases)
2. Find the latest release
3. Download `AvatarOS.exe` from the Assets section
4. Double-click to run!

**Note:** Releases are automatically built when we create version tags. If you don't see a release yet, use Option 2 or 3 below.

### Option 2: Download from GitHub Actions Artifacts

Every time code is pushed, GitHub Actions automatically builds AvatarOS.exe:

1. Go to the [Actions tab](../../actions)
2. Click on the latest successful workflow run
3. Scroll down to "Artifacts"
4. Download `AvatarOS-exe`
5. Extract the zip file
6. Run AvatarOS.exe

### Option 3: Build It Yourself

If you want to build from source:

```bash
# 1. Clone the repository
git clone https://github.com/zmfspotify-rgb/pro.git
cd pro

# 2. Install dependencies
npm install

# 3. Build AvatarOS.exe
npm run build

# 4. The file will be in dist/AvatarOS.exe
```

Build time: ~2-5 minutes depending on your computer.

## 🚀 Quick Start After Getting AvatarOS.exe

1. **Run AvatarOS.exe** - Double-click the file
2. **Configure** - Edit settings with `AvatarOS.exe --config`
3. **Upload Plugins/Mods** - Drop files in `/plugins` or `/mods` folders
4. **Watch AI Learn** - AI automatically discovers and learns to use them!

## 📦 What You Get

AvatarOS.exe is a **complete standalone executable** that includes:

✅ Node.js runtime (bundled)
✅ All dependencies
✅ All AvatarOS features:
  - AI Memory System
  - Dynamic Plugin/Mod Learning
  - Twitch Streaming
  - Voice Models (16 voices)
  - Config Editor
  - Everything!

**No additional installation required!**

## 🔧 System Requirements

- **Windows**: 7 or later (64-bit)
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB free space
- **Network**: Internet connection for Minecraft and Twitch

## ❓ Troubleshooting

### "Windows protected your PC" warning

This is normal for unsigned executables:
1. Click "More info"
2. Click "Run anyway"

### Can't find the download

- **For Releases**: Check if any tags have been created
- **For Actions**: Make sure you're logged into GitHub
- **Build yourself**: Follow Option 3 above

### Download is slow

The file is 426MB, so it may take a few minutes depending on your internet speed.

## 🆘 Still Need Help?

1. Check the [README.md](../README.md) for full documentation
2. Read [AVATARSOS_GUIDE.md](../AVATARSOS_GUIDE.md) for detailed usage
3. Open an issue if you encounter problems

---

**Remember**: You only need to download AvatarOS.exe **once**. After that, you can:
- Upload unlimited plugins/mods
- Edit all settings in the GUI
- Let AI learn everything automatically

No manual installation of features needed! 🎉
