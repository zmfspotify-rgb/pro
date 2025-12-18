/**
 * Example: Capture a tiled view of all bots
 * This script demonstrates how to use the capture system
 */

const { PuppeteerTiler } = require('../capture/puppeteer-tiler');
const { createVideoFromScreenshots } = require('../capture/ffmpeg-helpers');
const path = require('path');
const fs = require('fs');

async function exampleCapture() {
  console.log('Example: Capturing tiled bot viewers');
  console.log('=====================================\n');
  
  // Load configuration
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  
  // Create tiler instance
  const tiler = new PuppeteerTiler(config.capture);
  
  try {
    // Initialize browser and pages
    console.log('Step 1: Initializing browser...');
    await tiler.initialize(config.bots);
    
    // Take a screenshot
    console.log('\nStep 2: Taking screenshot...');
    const screenshotPath = path.join(config.capture.outputDir, 'screenshot.png');
    await tiler.takeScreenshot(screenshotPath);
    
    // Record for 10 seconds
    console.log('\nStep 3: Recording 10-second video...');
    const videoPath = path.join(config.capture.outputDir, 'recording.mp4');
    const recording = await tiler.startRecording(videoPath, 10);
    
    // Create video from screenshots
    if (recording && recording.screenshotDir) {
      console.log('\nStep 4: Creating video file...');
      await createVideoFromScreenshots(
        recording.screenshotDir,
        videoPath,
        config.capture.ffmpeg
      );
      console.log(`\nVideo saved to: ${videoPath}`);
    }
    
    console.log('\nExample completed successfully!');
  } catch (error) {
    console.error('Error during capture:', error.message);
  } finally {
    // Cleanup
    await tiler.cleanup();
  }
}

// Run if executed directly
if (require.main === module) {
  exampleCapture().catch(console.error);
}

module.exports = { exampleCapture };
