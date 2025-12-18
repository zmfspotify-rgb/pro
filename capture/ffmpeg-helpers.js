const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Convert screenshots to video using FFmpeg
 */
function createVideoFromScreenshots(screenshotDir, outputPath, config) {
  return new Promise((resolve, reject) => {
    console.log('[FFmpeg-Helpers] Creating video from screenshots...');
    
    const pattern = path.join(screenshotDir, 'frame_%06d.png');
    
    ffmpeg()
      .input(pattern)
      .inputFPS(config.fps || 30)
      .videoCodec(config.codec || 'libx264')
      .outputOptions([
        `-preset ${config.preset || 'medium'}`,
        `-crf ${config.crf || 23}`,
        '-pix_fmt yuv420p'
      ])
      .output(outputPath)
      .on('start', (commandLine) => {
        console.log('[FFmpeg-Helpers] FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`[FFmpeg-Helpers] Processing: ${Math.floor(progress.percent)}% done`);
        }
      })
      .on('end', () => {
        console.log(`[FFmpeg-Helpers] Video created: ${outputPath}`);
        
        // Cleanup screenshot frames
        cleanupFrames(screenshotDir);
        
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('[FFmpeg-Helpers] Error creating video:', err.message);
        reject(err);
      })
      .run();
  });
}

/**
 * Stream video to RTMP endpoint
 */
function streamToRTMP(inputPath, rtmpUrl, config) {
  return new Promise((resolve, reject) => {
    console.log(`[FFmpeg-Helpers] Streaming to RTMP: ${rtmpUrl}`);
    
    const stream = ffmpeg(inputPath)
      .inputOptions(['-re']) // Read input at native frame rate
      .videoCodec(config.codec || 'libx264')
      .outputOptions([
        `-preset ${config.preset || 'veryfast'}`,
        '-tune zerolatency',
        '-g 60',
        '-f flv'
      ])
      .output(rtmpUrl)
      .on('start', (commandLine) => {
        console.log('[FFmpeg-Helpers] FFmpeg streaming command:', commandLine);
      })
      .on('progress', (progress) => {
        console.log(`[FFmpeg-Helpers] Streaming: ${progress.timemark}`);
      })
      .on('end', () => {
        console.log('[FFmpeg-Helpers] Streaming ended');
        resolve();
      })
      .on('error', (err) => {
        console.error('[FFmpeg-Helpers] Streaming error:', err.message);
        reject(err);
      });
    
    stream.run();
    
    return stream;
  });
}

/**
 * Concatenate multiple videos
 */
function concatenateVideos(videoPaths, outputPath, config) {
  return new Promise((resolve, reject) => {
    console.log('[FFmpeg-Helpers] Concatenating videos...');
    
    // Create concat file
    const concatFile = path.join(path.dirname(outputPath), 'concat_list.txt');
    const fileList = videoPaths.map(p => `file '${p}'`).join('\n');
    fs.writeFileSync(concatFile, fileList);
    
    ffmpeg()
      .input(concatFile)
      .inputOptions(['-f concat', '-safe 0'])
      .videoCodec('copy')
      .output(outputPath)
      .on('end', () => {
        console.log(`[FFmpeg-Helpers] Videos concatenated: ${outputPath}`);
        fs.unlinkSync(concatFile);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('[FFmpeg-Helpers] Concatenation error:', err.message);
        if (fs.existsSync(concatFile)) {
          fs.unlinkSync(concatFile);
        }
        reject(err);
      })
      .run();
  });
}

/**
 * Add audio to video
 */
function addAudioToVideo(videoPath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log('[FFmpeg-Helpers] Adding audio to video...');
    
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions(['-c:v copy', '-c:a aac', '-shortest'])
      .output(outputPath)
      .on('end', () => {
        console.log(`[FFmpeg-Helpers] Audio added: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('[FFmpeg-Helpers] Audio addition error:', err.message);
        reject(err);
      })
      .run();
  });
}

/**
 * Get video information
 */
function getVideoInfo(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}

/**
 * Cleanup screenshot frames
 */
function cleanupFrames(screenshotDir) {
  try {
    const files = fs.readdirSync(screenshotDir);
    
    for (const file of files) {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(screenshotDir, file));
      }
    }
    
    fs.rmSync(screenshotDir, { recursive: true, force: true });
    console.log('[FFmpeg-Helpers] Screenshot frames cleaned up');
  } catch (error) {
    console.error('[FFmpeg-Helpers] Error cleaning up frames:', error.message);
  }
}

module.exports = {
  createVideoFromScreenshots,
  streamToRTMP,
  concatenateVideos,
  addAudioToVideo,
  getVideoInfo,
  cleanupFrames
};
