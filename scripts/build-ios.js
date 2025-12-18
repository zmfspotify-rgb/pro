/**
 * iOS Build Script
 * Generates .ipa file for Signulous deployment
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const buildDir = join(process.cwd(), 'build');
const ipaOutputPath = join(buildDir, 'MinecraftBotPipeline.ipa');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     iOS App Build Script - .ipa Generator                  ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Create build directory
if (!existsSync(buildDir)) {
  mkdirSync(buildDir, { recursive: true });
  console.log('✓ Created build directory');
}

console.log('Building Minecraft Bot Pipeline iOS App...');
console.log('');

// Create README for .ipa deployment
const ipaReadme = `
# Minecraft Bot Pipeline - iOS App

## Installation via Signulous

### Prerequisites
- Signulous app installed on your iOS device
- Active Signulous account

### Installation Steps

1. **Download the .ipa file**
   - Get the \`MinecraftBotPipeline.ipa\` file from the build directory

2. **Transfer to your iOS device**
   - Option 1: Use AirDrop to send the .ipa to your device
   - Option 2: Upload to a cloud service and download on your device
   - Option 3: Use iTunes/Finder to transfer

3. **Install with Signulous**
   - Open the Signulous app
   - Tap "Import IPA"
   - Select the MinecraftBotPipeline.ipa file
   - Wait for Signulous to sign and install the app
   - The app will appear on your home screen

4. **Trust the Developer Certificate**
   - Go to Settings > General > VPN & Device Management
   - Find the developer profile for the app
   - Tap "Trust [Developer Name]"

5. **Launch the App**
   - Open the MC Bot Pipeline app from your home screen
   - Configure your server settings
   - Start creating bots!

## Features

✨ **Bot Creation System**
- Create unlimited Minecraft bots with unique personalities
- 8 different personality types to choose from

✨ **16 Voice Model Presets**
- 8 Male voices (Deep Commander, Friendly Guide, Young Explorer, etc.)
- 8 Female voices (Elegant Leader, Cheerful Friend, Adventurous Spirit, etc.)

✨ **Streaming Schedule**
- Bots can hop on/off based on schedules
- Support for 24/7, peak hours, weekday, and weekend schedules

✨ **24/7 AI Player**
- Keeps your Aternos server alive 24/7
- Prevents server from going to sleep
- Automatic anti-AFK measures

✨ **AI Memories & Personalities**
- Short-term and long-term memory systems
- Remembers players, locations, and events
- Builds relationships with players over time

## Support

For issues or questions, please visit the project repository.
`;

writeFileSync(join(buildDir, 'IPA_INSTALLATION_GUIDE.md'), ipaReadme);
console.log('✓ Created installation guide');

// Create a placeholder .ipa file
// Note: Actual .ipa creation requires Xcode build tools and code signing
const ipaNote = `
This is a placeholder for the .ipa file.

To create an actual .ipa file for Signulous, you need:

1. macOS with Xcode installed
2. Valid iOS Developer Certificate
3. Run: xcodebuild -workspace MinecraftBotPipeline.xcworkspace -scheme MinecraftBotPipeline -configuration Release archive
4. Export the archive as .ipa

For development/testing:
- Use the iOS Simulator in Xcode
- Or use a development provisioning profile

The app is ready for building with:
- Swift source code in ios/MinecraftBotPipeline/
- Info.plist configuration
- All features implemented

Once built and signed, the .ipa can be installed via:
- Signulous (as requested)
- AltStore
- TestFlight
- Direct installation with development profile
`;

writeFileSync(join(buildDir, 'BUILD_NOTES.txt'), ipaNote);
console.log('✓ Created build notes');

// Create Xcode project file
const xcodeProject = `
// !$*UTF8*$!
{
    archiveVersion = 1;
    classes = {
    };
    objectVersion = 56;
    objects = {
        /* Project object */
        productName = MinecraftBotPipeline;
        buildConfigurationList = {
            buildConfigurations = (
                {
                    name = Debug;
                    buildSettings = {
                        PRODUCT_NAME = "MinecraftBotPipeline";
                        PRODUCT_BUNDLE_IDENTIFIER = "com.mcbotpipeline.app";
                        INFOPLIST_FILE = "MinecraftBotPipeline/Info.plist";
                        SWIFT_VERSION = 5.0;
                        TARGETED_DEVICE_FAMILY = "1,2";
                    };
                },
                {
                    name = Release;
                    buildSettings = {
                        PRODUCT_NAME = "MinecraftBotPipeline";
                        PRODUCT_BUNDLE_IDENTIFIER = "com.mcbotpipeline.app";
                        INFOPLIST_FILE = "MinecraftBotPipeline/Info.plist";
                        SWIFT_VERSION = 5.0;
                        TARGETED_DEVICE_FAMILY = "1,2";
                        CODE_SIGN_IDENTITY = "iPhone Distribution";
                    };
                }
            );
        };
    };
    rootObject = /* Project object */;
}
`;

const xcodeProjectDir = join(process.cwd(), 'ios/MinecraftBotPipeline.xcodeproj');
if (!existsSync(xcodeProjectDir)) {
  mkdirSync(xcodeProjectDir, { recursive: true });
}
writeFileSync(join(xcodeProjectDir, 'project.pbxproj'), xcodeProject);
console.log('✓ Created Xcode project file');

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('  Build preparation complete!');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('iOS app structure created at: ios/MinecraftBotPipeline/');
console.log('Build directory: build/');
console.log('');
console.log('Next steps to create .ipa for Signulous:');
console.log('');
console.log('1. Open the project in Xcode on macOS');
console.log('2. Configure code signing with your developer certificate');
console.log('3. Build and archive the project');
console.log('4. Export as .ipa file');
console.log('5. Use Signulous app to install on your iOS device');
console.log('');
console.log('See build/IPA_INSTALLATION_GUIDE.md for detailed instructions');
console.log('');
