/**
 * AISMP Bot Orchestration System - Example Usage
 * 
 * This example demonstrates how to use the AISMP system to manage
 * bot assignments across multiple streaming platforms.
 */

import { loadConfigs, BotOrchestrator } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example 1: Load configuration and create orchestrator
console.log('=== AISMP Bot Orchestration System - Example Usage ===\n');

const configPath = path.resolve(__dirname, '../config/bots.yaml');
const config = loadConfigs(configPath);

console.log('✓ Configuration loaded successfully');
console.log(`  - Bots: ${config.bots.size}`);
console.log(`  - Channels: ${config.channels.size}`);
console.log(`  - Routes: ${config.routes.length}\n`);

// Create orchestrator
const orchestrator = new BotOrchestrator(config);
console.log('✓ Orchestrator initialized\n');

// Example 2: Display available bots
console.log('--- Available Bots ---');
const availableBots = orchestrator.getAvailableBots();
availableBots.forEach(bot => {
  console.log(`  - ${bot.name} (${bot.id})`);
  console.log(`    Role: ${bot.role}`);
  console.log(`    Platforms: ${bot.platforms.join(', ')}`);
  console.log(`    Active Channels: ${bot.activeChannels}`);
});
console.log();

// Example 3: Display routing table
console.log('--- Routing Table ---');
config.routes.forEach(route => {
  console.log(`  Channel: ${route.channelName} (${route.platform})`);
  console.log(`    Primary Bots: ${route.primaryBots.map(b => b.name).join(', ') || 'None'}`);
  console.log(`    Fallback Bots: ${route.fallbackBots.map(b => b.name).join(', ') || 'None'}`);
  console.log(`    Required Capabilities: ${route.requiredCapabilities.join(', ') || 'None'}`);
});
console.log();

// Example 4: Assign bots to channels
console.log('--- Assigning Bots to Channels ---');

// Assign to first channel
const assignment1 = orchestrator.assignBot('channel_001');
if (assignment1.success) {
  console.log(`✓ ${assignment1.message}`);
  console.log(`  Assignment Type: ${assignment1.assignmentType}`);
} else {
  console.log(`✗ Failed: ${assignment1.message}`);
}

// Assign to second channel
const assignment2 = orchestrator.assignBot('channel_002');
if (assignment2.success) {
  console.log(`✓ ${assignment2.message}`);
  console.log(`  Assignment Type: ${assignment2.assignmentType}`);
} else {
  console.log(`✗ Failed: ${assignment2.message}`);
}

// Assign to third channel
const assignment3 = orchestrator.assignBot('channel_003');
if (assignment3.success) {
  console.log(`✓ ${assignment3.message}`);
  console.log(`  Assignment Type: ${assignment3.assignmentType}`);
} else {
  console.log(`✗ Failed: ${assignment3.message}`);
}
console.log();

// Example 5: Display current assignments
console.log('--- Current Assignments ---');
const assignments = orchestrator.getAssignments();
assignments.forEach(assignment => {
  const bot = config.bots.get(assignment.botId);
  const channel = config.channels.get(assignment.channelId);
  console.log(`  - ${channel.name} ← ${bot.name}`);
  console.log(`    Platform: ${channel.platform}`);
  console.log(`    Type: ${assignment.assignmentType}`);
  console.log(`    Assigned At: ${new Date(assignment.assignedAt).toISOString()}`);
});
console.log();

// Example 6: Check bot status
console.log('--- Bot Status ---');
config.bots.forEach((bot, id) => {
  const status = orchestrator.getBotStatus(id);
  console.log(`  ${status.name}:`);
  console.log(`    Available: ${status.available ? 'Yes' : 'No'}`);
  console.log(`    Active Channels: ${status.activeChannels.length}`);
  if (status.activeChannels.length > 0) {
    status.activeChannels.forEach(channelId => {
      const channel = config.channels.get(channelId);
      console.log(`      - ${channel.name}`);
    });
  }
});
console.log();

// Example 7: Unassign a bot
console.log('--- Unassigning Bot from Channel ---');
const unassignResult = orchestrator.unassignBot('channel_001');
if (unassignResult.success) {
  console.log(`✓ ${unassignResult.message}`);
} else {
  console.log(`✗ Failed: ${unassignResult.message}`);
}
console.log();

// Example 8: Final state
console.log('--- Final Assignments ---');
const finalAssignments = orchestrator.getAssignments();
console.log(`Total active assignments: ${finalAssignments.length}`);
finalAssignments.forEach(assignment => {
  const bot = config.bots.get(assignment.botId);
  const channel = config.channels.get(assignment.channelId);
  console.log(`  - ${channel.name} ← ${bot.name} (${assignment.assignmentType})`);
});

console.log('\n=== Example Complete ===');
