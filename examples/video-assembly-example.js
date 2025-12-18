/**
 * Example: Video Assembly and Editing
 * This script demonstrates how to assemble and edit videos
 */

const { assembleVideo, createHighlightReel, addIntroOutro } = require('../editor/assemble-video');
const path = require('path');

async function exampleVideoAssembly() {
  console.log('Example: Video Assembly');
  console.log('=======================\n');
  
  // Example 1: Concatenate multiple clips
  console.log('Example 1: Concatenating clips...');
  const clips = [
    './output/session1.mp4',
    './output/session2.mp4',
    './output/session3.mp4'
  ];
  
  // Note: These files would need to exist for this to work
  // This is just demonstrating the API
  
  /*
  const result = await assembleVideo(clips, './output/final_video.mp4');
  console.log('Assembled video:', result.outputPath);
  */
  
  // Example 2: Create highlight reel
  console.log('\nExample 2: Creating highlight reel...');
  /*
  const highlightReel = await createHighlightReel(
    './output/recordings',
    './output/highlights.mp4',
    300 // 5 minutes max
  );
  console.log('Highlight reel:', highlightReel.outputPath);
  */
  
  // Example 3: Add intro/outro
  console.log('\nExample 3: Adding intro/outro...');
  /*
  const finalVideo = await addIntroOutro(
    './output/main_content.mp4',
    './assets/intro.mp4',
    './assets/outro.mp4',
    './output/complete_video.mp4'
  );
  console.log('Final video with intro/outro:', finalVideo.outputPath);
  */
  
  console.log('\nNote: Uncomment code sections to run actual video processing');
  console.log('Make sure input video files exist before running');
}

// Run if executed directly
if (require.main === module) {
  exampleVideoAssembly().catch(console.error);
}

module.exports = { exampleVideoAssembly };
