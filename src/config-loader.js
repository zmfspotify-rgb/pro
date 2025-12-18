/**
 * AISMP (AI Streamer Multi-Platform) Bot Orchestration System
 * Core configuration loader and validator
 */

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

/**
 * Load and parse bot configuration from YAML file or environment
 * @param {string|object} source - Path to YAML file or config object
 * @returns {object} Parsed and validated configuration
 */
export function loadConfigs(source) {
  let config;

  // Handle different source types
  if (typeof source === 'string') {
    // Load from file path
    const configPath = path.resolve(source);
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    const fileContent = fs.readFileSync(configPath, 'utf8');
    config = yaml.load(fileContent);
  } else if (typeof source === 'object' && source !== null) {
    // Use provided object directly
    config = source;
  } else {
    throw new Error('Invalid configuration source. Expected file path or object.');
  }

  // Validate configuration structure
  validateConfig(config);

  // Normalize and sanitize routes
  const normalized = normalizeConfig(config);

  return normalized;
}

/**
 * Validate configuration structure and required fields
 * @param {object} config - Configuration to validate
 */
function validateConfig(config) {
  if (!config) {
    throw new Error('Configuration is empty');
  }

  if (!config.bots || !Array.isArray(config.bots)) {
    throw new Error('Configuration must include "bots" array');
  }

  if (!config.channels || !Array.isArray(config.channels)) {
    throw new Error('Configuration must include "channels" array');
  }

  // Validate each bot
  config.bots.forEach((bot, index) => {
    if (!bot.id) {
      throw new Error(`Bot at index ${index} is missing required field: id`);
    }
    if (!bot.name) {
      throw new Error(`Bot "${bot.id}" is missing required field: name`);
    }
    if (!bot.role || !['solo', 'collab'].includes(bot.role)) {
      throw new Error(`Bot "${bot.id}" must have role of "solo" or "collab"`);
    }
    if (!bot.platforms || !Array.isArray(bot.platforms)) {
      throw new Error(`Bot "${bot.id}" is missing required field: platforms (array)`);
    }
  });

  // Validate each channel
  config.channels.forEach((channel, index) => {
    if (!channel.id) {
      throw new Error(`Channel at index ${index} is missing required field: id`);
    }
    if (!channel.platform) {
      throw new Error(`Channel "${channel.id}" is missing required field: platform`);
    }
  });

  return true;
}

/**
 * Normalize configuration and sanitize routes
 * @param {object} config - Raw configuration
 * @returns {object} Normalized configuration with sanitized routes
 */
function normalizeConfig(config) {
  const normalized = {
    bots: new Map(),
    channels: new Map(),
    routes: [],
    defaults: config.defaults || {}
  };

  // Process bots
  config.bots.forEach(bot => {
    const normalizedBot = {
      id: bot.id,
      name: bot.name,
      role: bot.role,
      platforms: bot.platforms || [],
      priority: bot.priority || 999,
      capabilities: bot.capabilities || [],
      backupBots: bot.backup_bots || [],
      schedule: normalizeSchedule(bot.schedule),
      status: 'available'
    };
    normalized.bots.set(bot.id, normalizedBot);
  });

  // Process channels
  config.channels.forEach(channel => {
    const normalizedChannel = {
      id: channel.id,
      name: channel.name || channel.id,
      platform: channel.platform,
      preferredBots: channel.preferred_bots || [],
      fallbackBots: channel.fallback_bots || [],
      requiredCapabilities: channel.requires_capabilities || [],
      assignedBot: null
    };
    normalized.channels.set(channel.id, normalizedChannel);
  });

  // Create routing table (sane routes)
  normalized.routes = createRoutes(normalized.bots, normalized.channels);

  // Set defaults
  normalized.defaults = {
    fallbackStrategy: config.defaults?.fallback_strategy || 'round_robin',
    maxRetries: config.defaults?.max_retries || 3,
    assignmentTimeout: config.defaults?.assignment_timeout || 30,
    healthCheckInterval: config.defaults?.health_check_interval || 60
  };

  return normalized;
}

/**
 * Normalize schedule configuration
 * @param {object} schedule - Raw schedule object
 * @returns {object} Normalized schedule
 */
function normalizeSchedule(schedule) {
  if (!schedule) {
    return {
      timezone: 'UTC',
      activeHours: { start: '00:00', end: '23:59' },
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    };
  }

  return {
    timezone: schedule.timezone || 'UTC',
    activeHours: schedule.active_hours || { start: '00:00', end: '23:59' },
    days: schedule.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  };
}

/**
 * Create routing table for bot-channel assignments
 * @param {Map} bots - Map of bots
 * @param {Map} channels - Map of channels
 * @returns {Array} Array of route objects
 */
function createRoutes(bots, channels) {
  const routes = [];

  channels.forEach(channel => {
    const route = {
      channelId: channel.id,
      channelName: channel.name,
      platform: channel.platform,
      primaryBots: [],
      fallbackBots: [],
      requiredCapabilities: channel.requiredCapabilities
    };

    // Find primary bots (preferred bots that match platform and capabilities)
    channel.preferredBots.forEach(botId => {
      const bot = bots.get(botId);
      if (bot && bot.platforms.includes(channel.platform)) {
        const hasCapabilities = channel.requiredCapabilities.every(cap =>
          bot.capabilities.includes(cap)
        );
        if (hasCapabilities) {
          route.primaryBots.push({
            id: bot.id,
            name: bot.name,
            priority: bot.priority,
            role: bot.role
          });
        }
      }
    });

    // Sort primary bots by priority
    route.primaryBots.sort((a, b) => a.priority - b.priority);

    // Find fallback bots
    channel.fallbackBots.forEach(botId => {
      const bot = bots.get(botId);
      if (bot && bot.platforms.includes(channel.platform)) {
        route.fallbackBots.push({
          id: bot.id,
          name: bot.name,
          priority: bot.priority,
          role: bot.role
        });
      }
    });

    // Sort fallback bots by priority
    route.fallbackBots.sort((a, b) => a.priority - b.priority);

    routes.push(route);
  });

  return routes;
}

/**
 * Load configuration from environment variables
 * @returns {object} Configuration object from environment
 */
export function loadFromEnv() {
  const configPath = process.env.AISMP_CONFIG_PATH || 'config/bots.yaml';
  return loadConfigs(configPath);
}

export default {
  loadConfigs,
  loadFromEnv
};
