/**
 * Tests for config-loader.js
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { loadConfigs } from '../src/config-loader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Config Loader', () => {
  let config;

  before(() => {
    const configPath = path.resolve(__dirname, '../config/bots.yaml');
    config = loadConfigs(configPath);
  });

  it('should load configuration from YAML file', () => {
    assert.ok(config, 'Config should be loaded');
    assert.ok(config.bots instanceof Map, 'Bots should be a Map');
    assert.ok(config.channels instanceof Map, 'Channels should be a Map');
  });

  it('should parse all bots correctly', () => {
    assert.strictEqual(config.bots.size, 3, 'Should load 3 bots');
    
    const bot1 = config.bots.get('bot_001');
    assert.ok(bot1, 'Bot 001 should exist');
    assert.strictEqual(bot1.name, 'StreamBot Alpha');
    assert.strictEqual(bot1.role, 'solo');
    assert.ok(Array.isArray(bot1.platforms), 'Platforms should be array');
  });

  it('should parse all channels correctly', () => {
    assert.strictEqual(config.channels.size, 3, 'Should load 3 channels');
    
    const channel1 = config.channels.get('channel_001');
    assert.ok(channel1, 'Channel 001 should exist');
    assert.strictEqual(channel1.platform, 'twitch');
  });

  it('should normalize schedules', () => {
    const bot1 = config.bots.get('bot_001');
    assert.ok(bot1.schedule, 'Schedule should exist');
    assert.strictEqual(bot1.schedule.timezone, 'UTC');
    assert.ok(bot1.schedule.activeHours, 'Active hours should exist');
    assert.ok(Array.isArray(bot1.schedule.days), 'Days should be array');
  });

  it('should create routing table', () => {
    assert.ok(Array.isArray(config.routes), 'Routes should be array');
    assert.ok(config.routes.length > 0, 'Should have routes');
    
    const route1 = config.routes[0];
    assert.ok(route1.channelId, 'Route should have channel ID');
    assert.ok(Array.isArray(route1.primaryBots), 'Route should have primary bots');
  });

  it('should validate required bot fields', () => {
    const invalidConfig = {
      bots: [{ name: 'Test' }],
      channels: []
    };
    
    assert.throws(
      () => loadConfigs(invalidConfig),
      /missing required field: id/,
      'Should throw error for missing bot ID'
    );
  });

  it('should validate bot role', () => {
    const invalidConfig = {
      bots: [{ id: 'test', name: 'Test', role: 'invalid', platforms: [] }],
      channels: []
    };
    
    assert.throws(
      () => loadConfigs(invalidConfig),
      /must have role of "solo" or "collab"/,
      'Should throw error for invalid role'
    );
  });

  it('should set default values', () => {
    assert.ok(config.defaults, 'Defaults should exist');
    assert.ok(config.defaults.fallbackStrategy, 'Should have fallback strategy');
    assert.ok(config.defaults.maxRetries, 'Should have max retries');
  });

  it('should handle object input', () => {
    const testConfig = {
      bots: [
        {
          id: 'test_bot',
          name: 'Test Bot',
          role: 'solo',
          platforms: ['twitch']
        }
      ],
      channels: [
        {
          id: 'test_channel',
          platform: 'twitch'
        }
      ]
    };
    
    const loaded = loadConfigs(testConfig);
    assert.ok(loaded.bots.has('test_bot'), 'Should load bot from object');
  });

  it('should throw error for non-existent file', () => {
    assert.throws(
      () => loadConfigs('/non/existent/path.yaml'),
      /Configuration file not found/,
      'Should throw error for missing file'
    );
  });

  it('should prioritize bots by priority in routes', () => {
    const route = config.routes.find(r => r.channelId === 'channel_001');
    assert.ok(route, 'Should find route for channel_001');
    
    if (route.primaryBots.length > 1) {
      for (let i = 1; i < route.primaryBots.length; i++) {
        assert.ok(
          route.primaryBots[i - 1].priority <= route.primaryBots[i].priority,
          'Bots should be sorted by priority'
        );
      }
    }
  });
});
