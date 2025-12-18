const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');
const { createBot } = require('./bots/bot-core');
const { startScheduler } = require('./bots/everstream');
const { startMonitoring } = require('./monitoring');

// Global state
const state = {
  bots: [],
  config: null,
  schedulerInterval: null,
  isRunning: false
};

/**
 * Load configuration from config.json
 */
function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    state.config = JSON.parse(configData);
    console.log('[Config] Configuration loaded successfully');
    return state.config;
  } catch (error) {
    console.error('[Config] Error loading configuration:', error.message);
    process.exit(1);
  }
}

/**
 * Initialize all bots based on configuration
 */
async function initializeBots() {
  console.log('[Bots] Initializing bots...');
  
  const enabledBots = state.config.bots.filter(bot => bot.enabled);
  
  for (const botConfig of enabledBots) {
    try {
      const bot = await createBot({
        ...botConfig,
        server: state.config.server,
        behaviors: state.config.behaviors,
        captureConfig: state.config.capture
      });
      
      state.bots.push(bot);
      console.log(`[Bots] Bot ${botConfig.username} initialized successfully on port ${botConfig.viewerPort}`);
    } catch (error) {
      console.error(`[Bots] Error initializing bot ${botConfig.username}:`, error.message);
    }
  }
  
  console.log(`[Bots] ${state.bots.length} bot(s) initialized`);
}

/**
 * Check if current time matches any scheduled time
 */
function checkSchedule() {
  if (!state.config.scheduler.enabled) {
    return;
  }
  
  const now = DateTime.now().setZone(state.config.scheduler.timezone);
  const currentTime = now.toFormat('HH:mm');
  
  for (const schedule of state.config.scheduler.schedule) {
    if (schedule.time === currentTime && schedule.action === 'start' && !state.isRunning) {
      console.log(`[Scheduler] Scheduled start triggered at ${currentTime}`);
      startScheduledSession(schedule.duration);
    }
  }
}

/**
 * Start a scheduled session
 */
async function startScheduledSession(duration) {
  state.isRunning = true;
  console.log(`[Scheduler] Starting scheduled session for ${duration} minutes`);
  
  // Start all bots if not already started
  if (state.bots.length === 0) {
    await initializeBots();
  }
  
  // Start the everstream loop for all bots
  startScheduler(state.bots, state.config);
  
  // Schedule session end
  setTimeout(() => {
    console.log(`[Scheduler] Scheduled session ending after ${duration} minutes`);
    state.isRunning = false;
  }, duration * 60 * 1000);
}

/**
 * Graceful shutdown
 */
async function shutdown() {
  console.log('[Shutdown] Initiating graceful shutdown...');
  
  // Clear scheduler
  if (state.schedulerInterval) {
    clearInterval(state.schedulerInterval);
  }
  
  // Disconnect all bots
  for (const bot of state.bots) {
    try {
      if (bot.instance) {
        bot.instance.quit();
      }
      console.log(`[Shutdown] Bot ${bot.username} disconnected`);
    } catch (error) {
      console.error(`[Shutdown] Error disconnecting bot:`, error.message);
    }
  }
  
  console.log('[Shutdown] Shutdown complete');
  process.exit(0);
}

/**
 * Main application entry point
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Multi-Bot Minecraft Content Pipeline');
  console.log('='.repeat(60));
  
  // Load configuration
  loadConfig();
  
  // Create output directory if it doesn't exist
  const outputDir = state.config.capture.outputDir;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`[Setup] Created output directory: ${outputDir}`);
  }
  
  // Start monitoring server if enabled
  if (state.config.monitoring.enabled) {
    startMonitoring(state, state.config.monitoring.port);
  }
  
  // Initialize bots if scheduler is not enabled
  if (!state.config.scheduler.enabled) {
    await initializeBots();
    startScheduler(state.bots, state.config);
  } else {
    console.log('[Scheduler] Scheduler enabled, waiting for scheduled time...');
    // Check schedule every minute
    state.schedulerInterval = setInterval(checkSchedule, 60 * 1000);
    // Also check immediately
    checkSchedule();
  }
  
  // Setup shutdown handlers
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
  console.log('[Main] Application started successfully');
}

// Start the application
main().catch(error => {
  console.error('[Main] Fatal error:', error);
  process.exit(1);
});
