/**
 * Minecraft Bot Pipeline - Main Entry Point
 * A multi-bot Minecraft content pipeline with AI personalities and voice models
 */

import { BotManager } from './botManager.js';
import { listVoicePresets } from './voicePresets.js';
import { personalityTraits } from './aiPersonality.js';
import { create24x7Schedule, createPeakHoursSchedule } from './streamingSchedule.js';

const botManager = new BotManager();

// Configuration
const config = {
  server: {
    host: process.env.MC_HOST || 'localhost',
    port: parseInt(process.env.MC_PORT) || 25565,
    version: process.env.MC_VERSION || '1.20.1'
  },
  enable24x7: process.env.ENABLE_24X7 === 'true' || true,
  autoStart: process.env.AUTO_START === 'true' || false
};

/**
 * Initialize the bot system
 */
function initialize() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Minecraft Multi-Bot Content Pipeline v1.0             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Configure server
  botManager.setServerConfig(config.server);
  
  // Display available voice presets
  console.log('Available Voice Presets:');
  console.log('------------------------');
  const voices = listVoicePresets();
  voices.forEach(voice => {
    console.log(`  ${voice.id}: ${voice.name} (${voice.gender}) - ${voice.description}`);
  });
  console.log('');
  
  // Display available personalities
  console.log('Available Personalities:');
  console.log('------------------------');
  Object.entries(personalityTraits).forEach(([key, trait]) => {
    console.log(`  ${key}: ${trait.name} - ${trait.description}`);
  });
  console.log('');
  
  // Create 24/7 AI player if enabled
  if (config.enable24x7) {
    console.log('Starting 24/7 AI Player to keep Aternos server alive...');
    botManager.create24x7Player('AI_ServerKeeper');
    console.log('');
  }
  
  // Auto-start demo bots if configured
  if (config.autoStart) {
    startDemoBots();
  }
  
  // Set up schedule checker (runs every minute)
  setInterval(() => {
    botManager.checkSchedules();
  }, 60000);
  
  // Display usage instructions
  displayUsage();
}

/**
 * Start demo bots for testing
 */
function startDemoBots() {
  console.log('Starting demo bots...');
  
  // Create a builder bot with male voice
  botManager.createBot({
    username: 'Builder_Bob',
    personalityType: 'builder',
    voicePresetId: 'm2',
    schedule: createPeakHoursSchedule()
  });
  
  // Create an explorer bot with female voice
  botManager.createBot({
    username: 'Explorer_Emma',
    personalityType: 'explorer',
    voicePresetId: 'f4',
    schedule: createPeakHoursSchedule()
  });
  
  // Create a farmer bot
  botManager.createBot({
    username: 'Farmer_Fred',
    personalityType: 'farmer',
    voicePresetId: 'm8'
  });
  
  console.log('');
}

/**
 * Display usage instructions
 */
function displayUsage() {
  console.log('Usage Instructions:');
  console.log('===================');
  console.log('');
  console.log('The bot system is now running. You can:');
  console.log('');
  console.log('1. Create bots programmatically by importing BotManager');
  console.log('2. Bots will follow their schedules and hop on/off automatically');
  console.log('3. The 24/7 AI player keeps the Aternos server alive');
  console.log('4. Each bot has:');
  console.log('   - A unique personality (explorer, builder, warrior, etc.)');
  console.log('   - A voice preset (16 options: 8 male, 8 female)');
  console.log('   - Memory system (remembers players, locations, events)');
  console.log('   - AI-driven behaviors based on personality');
  console.log('');
  console.log('Environment Variables:');
  console.log('  MC_HOST      - Minecraft server host (default: localhost)');
  console.log('  MC_PORT      - Minecraft server port (default: 25565)');
  console.log('  MC_VERSION   - Minecraft version (default: 1.20.1)');
  console.log('  ENABLE_24X7  - Enable 24/7 keeper bot (default: true)');
  console.log('  AUTO_START   - Auto-start demo bots (default: false)');
  console.log('');
  console.log('Press Ctrl+C to stop all bots and exit');
  console.log('');
}

/**
 * Graceful shutdown
 */
function shutdown() {
  console.log('\n\nShutting down...');
  botManager.stopAllBots();
  console.log('✓ All bots stopped. Goodbye!');
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the system
initialize();

// Export for programmatic usage
export { botManager };
