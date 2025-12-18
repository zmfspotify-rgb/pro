/**
 * AISMP (AI Streamer Multi-Platform) Bot Orchestration System
 * Main entry point
 */

import { loadConfigs, loadFromEnv } from './config-loader.js';
import BotOrchestrator from './orchestrator.js';

export {
  loadConfigs,
  loadFromEnv,
  BotOrchestrator
};

export default {
  loadConfigs,
  loadFromEnv,
  BotOrchestrator
};
