const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * Capture and tile multiple bot viewers using Puppeteer
 */
class PuppeteerTiler {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.pages = [];
    this.isRecording = false;
  }
  
  /**
   * Initialize browser and pages
   */
  async initialize(botConfigs) {
    console.log('[Puppeteer-Tiler] Initializing browser...');
    
    this.browser = await puppeteer.launch({
      headless: this.config.headless ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=' + this.config.resolution.width + ',' + this.config.resolution.height
      ]
    });
    
    console.log('[Puppeteer-Tiler] Browser launched');
    
    // Create a page for each bot viewer
    for (const botConfig of botConfigs) {
      if (botConfig.enabled) {
        await this.addBotPage(botConfig);
      }
    }
    
    console.log(`[Puppeteer-Tiler] Initialized ${this.pages.length} viewer pages`);
  }
  
  /**
   * Add a page for a bot viewer
   */
  async addBotPage(botConfig) {
    const page = await this.browser.newPage();
    
    await page.setViewport({
      width: this.config.resolution.width / this.config.tiling.cols,
      height: this.config.resolution.height / this.config.tiling.rows
    });
    
    const url = `http://localhost:${botConfig.viewerPort}`;
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      console.log(`[Puppeteer-Tiler] Loaded viewer for ${botConfig.username} from ${url}`);
      
      this.pages.push({
        page: page,
        username: botConfig.username,
        port: botConfig.viewerPort
      });
    } catch (error) {
      console.error(`[Puppeteer-Tiler] Failed to load viewer for ${botConfig.username}:`, error.message);
      await page.close();
    }
  }
  
  /**
   * Create a tiled composite view
   */
  async createTiledView() {
    if (this.pages.length === 0) {
      console.error('[Puppeteer-Tiler] No pages available for tiling');
      return null;
    }
    
    console.log('[Puppeteer-Tiler] Creating tiled composite view...');
    
    const compositePage = await this.browser.newPage();
    await compositePage.setViewport({
      width: this.config.resolution.width,
      height: this.config.resolution.height
    });
    
    // Create HTML for tiled layout
    const tiledHTML = this.generateTiledHTML();
    await compositePage.setContent(tiledHTML);
    
    console.log('[Puppeteer-Tiler] Tiled view created');
    return compositePage;
  }
  
  /**
   * Generate HTML for tiled layout
   */
  generateTiledHTML() {
    const { rows, cols } = this.config.tiling;
    const frameWidth = 100 / cols;
    const frameHeight = 100 / rows;
    
    let iframes = '';
    
    this.pages.forEach((pageData, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      iframes += `
        <iframe 
          src="http://localhost:${pageData.port}"
          style="
            position: absolute;
            width: ${frameWidth}%;
            height: ${frameHeight}%;
            left: ${col * frameWidth}%;
            top: ${row * frameHeight}%;
            border: 1px solid #333;
            box-sizing: border-box;
          "
        ></iframe>
      `;
    });
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Multi-Bot Viewer Grid</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              background: #000;
            }
          </style>
        </head>
        <body>
          ${iframes}
        </body>
      </html>
    `;
  }
  
  /**
   * Take screenshot of tiled view
   */
  async takeScreenshot(outputPath) {
    const compositePage = await this.createTiledView();
    
    if (!compositePage) {
      return null;
    }
    
    // Wait for iframes to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await compositePage.screenshot({
      path: outputPath,
      fullPage: false
    });
    
    console.log(`[Puppeteer-Tiler] Screenshot saved to ${outputPath}`);
    await compositePage.close();
    
    return outputPath;
  }
  
  /**
   * Start recording tiled view
   */
  async startRecording(outputPath, duration) {
    console.log(`[Puppeteer-Tiler] Starting recording for ${duration} seconds...`);
    this.isRecording = true;
    
    const compositePage = await this.createTiledView();
    
    if (!compositePage) {
      return null;
    }
    
    // Wait for iframes to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshots at intervals for video creation
    const screenshots = [];
    const fps = this.config.ffmpeg.fps || 30;
    const interval = 1000 / fps;
    const totalFrames = duration * fps;
    
    const screenshotDir = path.join(path.dirname(outputPath), 'frames');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    for (let i = 0; i < totalFrames && this.isRecording; i++) {
      const framePath = path.join(screenshotDir, `frame_${String(i).padStart(6, '0')}.png`);
      await compositePage.screenshot({ path: framePath });
      screenshots.push(framePath);
      
      if (i % fps === 0) {
        console.log(`[Puppeteer-Tiler] Captured ${i} frames (${Math.floor(i / fps)}s)`);
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    await compositePage.close();
    
    console.log(`[Puppeteer-Tiler] Recording complete, ${screenshots.length} frames captured`);
    return { screenshots, screenshotDir };
  }
  
  /**
   * Stop recording
   */
  stopRecording() {
    this.isRecording = false;
    console.log('[Puppeteer-Tiler] Recording stopped');
  }
  
  /**
   * Close browser and cleanup
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('[Puppeteer-Tiler] Browser closed');
    }
  }
}

module.exports = { PuppeteerTiler };
