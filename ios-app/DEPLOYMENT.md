# iOS App Deployment Guide

This guide explains how to build and deploy the iOS launcher app.

## Prerequisites

1. **Apple Developer Account** (required for App Store or TestFlight distribution)
2. **Expo Account** (free) - Sign up at https://expo.dev
3. **EAS CLI** - Install with `npm install -g eas-cli`

## Building the IPA

### Option 1: Using Expo Application Services (EAS) - Recommended

EAS handles the build process in the cloud, so you don't need a Mac.

1. **Login to Expo**
   ```bash
   cd ios-app
   eas login
   ```

2. **Configure the project**
   
   First, update `ios-app/app.json`:
   - Replace `REPLACE_WITH_YOUR_EAS_PROJECT_ID` with your actual project ID (will be generated)
   - Replace `your-expo-username` with your Expo username
   - Update `bundleIdentifier` to be unique (e.g., `com.yourcompany.minecraftbotlauncher`)
   
   Then run:
   ```bash
   eas build:configure
   ```

3. **Build for iOS**
   
   For internal testing (no App Store submission):
   ```bash
   eas build --platform ios --profile preview
   ```
   
   For App Store/TestFlight:
   ```bash
   eas build --platform ios --profile production
   ```

4. **Download the IPA**
   - The build will appear in your Expo dashboard
   - Download the IPA file when the build completes
   - You can install it on your device using tools like Apple Configurator or TestFlight

### Option 2: Local Build (Requires Mac)

If you have a Mac with Xcode installed:

1. **Prebuild the native iOS project**
   ```bash
   cd ios-app
   npx expo prebuild --platform ios
   ```

2. **Open in Xcode**
   ```bash
   open ios/MinecraftBotLauncher.xcworkspace
   ```

3. **Build in Xcode**
   - Select your development team
   - Choose a provisioning profile
   - Archive the app (Product > Archive)
   - Export the IPA

## Installing on Your Device

### Method 1: TestFlight (Easiest)

1. Submit the build to TestFlight using EAS:
   ```bash
   eas submit --platform ios
   ```

2. Add testers in App Store Connect
3. Install via TestFlight app on your iOS device

### Method 2: Direct Installation

1. Use **Apple Configurator** (Mac only)
2. Connect your device via USB
3. Drag and drop the IPA file
4. Trust the developer certificate on your device

### Method 3: Over-the-Air (OTA)

1. Use a service like **Diawi** or **TestApp.io**
2. Upload your IPA
3. Share the installation link
4. Open on your device and install

## Configuring the App

After installation:

1. **Open the app**
2. **Go to Settings**
3. **Set Server URL**
   - If backend is on your computer: `http://YOUR_COMPUTER_IP:3000`
   - If backend is hosted: `https://your-domain.com`
4. **Configure Minecraft and Twitch settings**
5. **Add bot IDs**
6. **Save configuration**

## Backend Server Setup for Remote Access

For the iOS app to connect to your backend from anywhere:

### Option 1: Local Network Only

- Start the backend: `npm start`
- Find your computer's IP address
- Use `http://YOUR_IP:3000` in the app
- Only works when on the same WiFi network

### Option 2: Expose to Internet (Temporary)

Using **ngrok**:

```bash
npm install -g ngrok
ngrok http 3000
```

Copy the HTTPS URL and use it in the app settings.

### Option 3: Deploy Backend to Cloud (Production)

Deploy to services like:
- **Heroku**: Easy deployment, free tier available
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS hosting
- **AWS/Google Cloud**: Enterprise options

Example for Railway:

1. Install Railway CLI: `npm install -g railway`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`
5. Get your app URL from Railway dashboard

## App Store Submission

To submit to the App Store:

1. **Prepare assets**
   - App icon (1024x1024)
   - Screenshots for various devices
   - App description

2. **Update app.json**
   ```json
   {
     "expo": {
       "name": "Minecraft Bot Launcher",
       "bundleIdentifier": "com.yourcompany.minecraftbotlauncher",
       "version": "1.0.0",
       "buildNumber": "1"
     }
   }
   ```

3. **Build for production**
   ```bash
   eas build --platform ios --profile production
   ```

4. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

5. **Fill in App Store Connect details**
   - App category
   - Privacy policy
   - Screenshots
   - Description

## Troubleshooting

### Build Fails

- Check your `app.json` configuration
- Ensure bundle identifier is unique
- Verify Apple Developer account is active

### App Crashes on Launch

- Check Expo version compatibility
- Review error logs in Xcode or Expo dashboard
- Ensure all dependencies are compatible

### Can't Connect to Backend

- Verify backend is running
- Check server URL in settings
- Ensure network connectivity
- For HTTPS, ensure valid SSL certificate

### Certificate Issues

- Use EAS to handle certificates automatically
- Or manually create certificates in Apple Developer portal
- Ensure provisioning profiles are valid

## Security Considerations

1. **Never commit sensitive data**
   - Keep Twitch credentials secure
   - Use environment variables
   - Don't hardcode server URLs with credentials

2. **Backend Security**
   - Use HTTPS in production
   - Implement authentication
   - Rate limit API endpoints
   - Validate all inputs

3. **Network Security**
   - Don't expose backend on public networks without security
   - Use VPN for remote access if needed
   - Implement API key authentication

## Updates

To publish updates:

1. Increment version in `app.json`
2. Build new version
3. Submit to TestFlight or App Store
4. Users update through TestFlight or App Store

For over-the-air updates (without App Store review):
```bash
eas update --branch production
```

## Support

For issues with:
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **App Store**: https://developer.apple.com/support/
- **Expo**: https://forums.expo.dev/
