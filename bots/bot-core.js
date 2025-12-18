const mineflayer = require('mineflayer');
const { attachViewer } = require('../viewer/attach-viewer');
const { initializeBehaviors } = require('./ai-behaviors');

/**
 * Create and initialize a Mineflayer bot
 */
async function createBot(config) {
  const botConfig = {
    host: config.server.host,
    port: config.server.port,
    username: config.username,
    version: config.server.version || false,
    auth: 'offline'
  };
  
  console.log(`[Bot-Core] Creating bot ${config.username}...`);
  
  const bot = mineflayer.createBot(botConfig);
  
  // Attach event handlers
  setupEventHandlers(bot, config);
  
  // Wait for spawn
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Bot spawn timeout'));
    }, 30000);
    
    bot.once('spawn', () => {
      clearTimeout(timeout);
      resolve();
    });
    
    bot.once('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
  
  // Attach viewer
  const viewer = attachViewer(bot, config.viewerPort);
  
  // Initialize AI behaviors
  if (config.behaviors) {
    initializeBehaviors(bot, config.behaviors);
  }
  
  return {
    instance: bot,
    username: config.username,
    viewerPort: config.viewerPort,
    viewer: viewer,
    config: config
  };
}

/**
 * Setup event handlers for the bot
 */
function setupEventHandlers(bot, config) {
  bot.on('spawn', () => {
    console.log(`[Bot-Core] ${config.username} spawned at ${bot.entity.position}`);
  });
  
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`[Bot-Core] ${config.username} heard: <${username}> ${message}`);
  });
  
  bot.on('error', (err) => {
    console.error(`[Bot-Core] ${config.username} error:`, err.message);
  });
  
  bot.on('kicked', (reason) => {
    console.log(`[Bot-Core] ${config.username} was kicked: ${reason}`);
    // Note: Auto-reconnect should be handled at the application level
    // to properly update bot registry and state
  });
  
  bot.on('end', () => {
    console.log(`[Bot-Core] ${config.username} disconnected`);
    // Note: Auto-reconnect should be handled at the application level
    // to properly update bot registry and state
  });
  
  bot.on('health', () => {
    if (bot.health <= 5) {
      console.log(`[Bot-Core] ${config.username} health low: ${bot.health}`);
    }
  });
  
  bot.on('death', () => {
    console.log(`[Bot-Core] ${config.username} died, respawning...`);
  });
}

module.exports = { createBot };
