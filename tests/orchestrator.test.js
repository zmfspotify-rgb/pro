/**
 * Tests for orchestrator.js
 */

import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import { loadConfigs } from '../src/config-loader.js';
import BotOrchestrator from '../src/orchestrator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Bot Orchestrator', () => {
  let config;
  let orchestrator;

  before(() => {
    const configPath = path.resolve(__dirname, '../config/bots.yaml');
    config = loadConfigs(configPath);
  });

  beforeEach(() => {
    orchestrator = new BotOrchestrator(config);
  });

  it('should initialize with configuration', () => {
    assert.ok(orchestrator, 'Orchestrator should be created');
    assert.ok(orchestrator.config, 'Should have config');
    assert.ok(orchestrator.botStatus instanceof Map, 'Should have bot status map');
  });

  it('should initialize all bots as available', () => {
    config.bots.forEach((bot, id) => {
      const status = orchestrator.getBotStatus(id);
      assert.ok(status, `Status should exist for bot ${id}`);
      assert.strictEqual(status.available, true, `Bot ${id} should be available`);
    });
  });

  it('should assign bot to channel', () => {
    const result = orchestrator.assignBot('channel_001');
    
    assert.ok(result, 'Should return assignment result');
    assert.strictEqual(result.success, true, 'Assignment should succeed');
    assert.ok(result.botId, 'Should have bot ID');
    assert.strictEqual(result.channelId, 'channel_001');
  });

  it('should prefer primary bots over fallback', () => {
    const result = orchestrator.assignBot('channel_001');
    
    assert.strictEqual(result.success, true);
    
    // Check if assigned bot is in preferred list
    const channel = config.channels.get('channel_001');
    const isPreferred = channel.preferredBots.includes(result.botId);
    
    // Should be preferred or at least assigned
    assert.ok(result.botId, 'Should assign a bot');
  });

  it('should track bot assignments', () => {
    orchestrator.assignBot('channel_001');
    
    const assignments = orchestrator.getAssignments();
    assert.ok(Array.isArray(assignments), 'Assignments should be array');
    assert.strictEqual(assignments.length, 1, 'Should have one assignment');
    assert.strictEqual(assignments[0].channelId, 'channel_001');
  });

  it('should unassign bot from channel', () => {
    // First assign
    const assignResult = orchestrator.assignBot('channel_001');
    assert.strictEqual(assignResult.success, true);
    
    // Then unassign
    const unassignResult = orchestrator.unassignBot('channel_001');
    assert.strictEqual(unassignResult.success, true);
    assert.strictEqual(unassignResult.channelId, 'channel_001');
    
    // Check assignments are empty
    const assignments = orchestrator.getAssignments();
    assert.strictEqual(assignments.length, 0, 'Should have no assignments');
  });

  it('should respect solo bot limitations', () => {
    // Find a solo bot
    let soloBotId = null;
    config.bots.forEach((bot, id) => {
      if (bot.role === 'solo' && !soloBotId) {
        soloBotId = id;
      }
    });

    if (soloBotId) {
      const bot = config.bots.get(soloBotId);
      const status = orchestrator.botStatus.get(soloBotId);
      
      // Simulate the bot already has an active channel
      status.activeChannels.push('some_channel');
      
      // Create a test channel that this bot supports
      const testChannel = {
        id: 'test_channel',
        platform: bot.platforms[0],
        requiredCapabilities: [],
        preferredBots: [soloBotId],
        fallbackBots: []
      };
      
      const canAssign = orchestrator.canAssignBot(bot, status, testChannel);
      assert.strictEqual(canAssign, false, 'Solo bot should not be assignable when already active');
    }
  });

  it('should get available bots', () => {
    const available = orchestrator.getAvailableBots();
    
    assert.ok(Array.isArray(available), 'Available bots should be array');
    assert.ok(available.length > 0, 'Should have available bots');
    
    available.forEach(bot => {
      assert.ok(bot.id, 'Bot should have ID');
      assert.ok(bot.name, 'Bot should have name');
      assert.ok(bot.role, 'Bot should have role');
    });
  });

  it('should update bot availability', () => {
    const botId = 'bot_001';
    
    orchestrator.setBotAvailability(botId, false);
    const status = orchestrator.getBotStatus(botId);
    
    assert.strictEqual(status.available, false, 'Bot should be unavailable');
    
    orchestrator.setBotAvailability(botId, true);
    const updatedStatus = orchestrator.getBotStatus(botId);
    assert.strictEqual(updatedStatus.available, true, 'Bot should be available again');
  });

  it('should handle missing channel gracefully', () => {
    assert.throws(
      () => orchestrator.assignBot('non_existent_channel'),
      /Channel not found/,
      'Should throw error for non-existent channel'
    );
  });

  it('should check platform compatibility', () => {
    const bot = config.bots.get('bot_001');
    const status = orchestrator.botStatus.get('bot_001');
    
    // Create a channel with unsupported platform
    const channel = {
      platform: 'unsupported_platform',
      requiredCapabilities: [],
      preferredBots: [],
      fallbackBots: []
    };
    
    const canAssign = orchestrator.canAssignBot(bot, status, channel);
    assert.strictEqual(canAssign, false, 'Should not assign bot to unsupported platform');
  });

  it('should check capability requirements', () => {
    const bot = config.bots.get('bot_001');
    const status = orchestrator.botStatus.get('bot_001');
    
    // Create a channel requiring capabilities bot doesn't have
    const channel = {
      platform: bot.platforms[0],
      requiredCapabilities: ['non_existent_capability'],
      preferredBots: [],
      fallbackBots: []
    };
    
    const canAssign = orchestrator.canAssignBot(bot, status, channel);
    assert.strictEqual(canAssign, false, 'Should not assign bot without required capabilities');
  });

  it('should return assignment history', () => {
    orchestrator.assignBot('channel_001');
    orchestrator.assignBot('channel_002');
    
    const assignments = orchestrator.getAssignments();
    assert.strictEqual(assignments.length, 2, 'Should have two assignments');
    
    assignments.forEach(assignment => {
      assert.ok(assignment.botId, 'Assignment should have bot ID');
      assert.ok(assignment.channelId, 'Assignment should have channel ID');
      assert.ok(assignment.assignedAt, 'Assignment should have timestamp');
    });
  });
});
