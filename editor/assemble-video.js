const { concatenateVideos, addAudioToVideo } = require('../capture/ffmpeg-helpers');
const path = require('path');
const fs = require('fs');

/**
 * Assemble multiple video clips into a final video
 */
async function assembleVideo(clips, outputPath, options = {}) {
  console.log('[Assemble-Video] Starting video assembly...');
  
  if (!clips || clips.length === 0) {
    throw new Error('No video clips provided');
  }
  
  // Validate all clips exist
  for (const clip of clips) {
    if (!fs.existsSync(clip)) {
      throw new Error(`Clip not found: ${clip}`);
    }
  }
  
  try {
    let finalVideo = outputPath;
    
    // Step 1: Concatenate all clips
    if (clips.length > 1) {
      console.log(`[Assemble-Video] Concatenating ${clips.length} clips...`);
      await concatenateVideos(clips, outputPath, {});
    } else {
      // Single clip, just copy
      console.log('[Assemble-Video] Single clip, copying...');
      fs.copyFileSync(clips[0], outputPath);
    }
    
    // Step 2: Add audio if provided
    if (options.audioTrack && fs.existsSync(options.audioTrack)) {
      console.log('[Assemble-Video] Adding audio track...');
      const tempOutput = outputPath.replace('.mp4', '_with_audio.mp4');
      await addAudioToVideo(finalVideo, options.audioTrack, tempOutput);
      
      // Replace original with audio version
      fs.unlinkSync(finalVideo);
      fs.renameSync(tempOutput, finalVideo);
    }
    
    console.log(`[Assemble-Video] Video assembly complete: ${finalVideo}`);
    
    return {
      outputPath: finalVideo,
      clipCount: clips.length,
      hasAudio: !!options.audioTrack
    };
  } catch (error) {
    console.error('[Assemble-Video] Error assembling video:', error.message);
    throw error;
  }
}

/**
 * Create a highlight reel from recorded sessions
 */
async function createHighlightReel(sessionDir, outputPath, maxDuration = 300) {
  console.log('[Assemble-Video] Creating highlight reel...');
  
  // Find all videos in session directory
  const videos = fs.readdirSync(sessionDir)
    .filter(file => file.endsWith('.mp4'))
    .map(file => path.join(sessionDir, file));
  
  if (videos.length === 0) {
    throw new Error('No videos found in session directory');
  }
  
  // For now, just concatenate all videos
  // In a real implementation, you might want to:
  // - Extract interesting moments (high activity, events, etc.)
  // - Trim videos to fit within maxDuration
  // - Add transitions
  
  const result = await assembleVideo(videos, outputPath);
  
  console.log(`[Assemble-Video] Highlight reel created with ${videos.length} clips`);
  return result;
}

/**
 * Add intro/outro to a video
 */
async function addIntroOutro(videoPath, introPath, outroPath, outputPath) {
  console.log('[Assemble-Video] Adding intro/outro...');
  
  const clips = [];
  
  if (introPath && fs.existsSync(introPath)) {
    clips.push(introPath);
  }
  
  clips.push(videoPath);
  
  if (outroPath && fs.existsSync(outroPath)) {
    clips.push(outroPath);
  }
  
  return await assembleVideo(clips, outputPath);
}

module.exports = {
  assembleVideo,
  createHighlightReel,
  addIntroOutro
};
