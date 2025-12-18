/**
 * Everstream - Continuous bot activity loop
 */

let loopIntervals = [];

/**
 * Start the scheduler loop for all bots
 */
function startScheduler(bots, config) {
  console.log('[Everstream] Starting activity loops for all bots...');
  
  bots.forEach(bot => {
    startBotLoop(bot, config);
  });
}

/**
 * Start activity loop for a single bot
 */
function startBotLoop(bot, config) {
  const instance = bot.instance;
  
  if (!instance) {
    console.error(`[Everstream] Bot ${bot.username} has no instance`);
    return;
  }
  
  console.log(`[Everstream] Starting loop for ${bot.username}`);
  
  // Main activity loop - execute behaviors periodically
  const activityInterval = setInterval(() => {
    if (!instance.entity) {
      console.log(`[Everstream] Bot ${bot.username} not ready, skipping activity`);
      return;
    }
    
    const behaviors = config.behaviors;
    const random = Math.random();
    
    try {
      if (random < 0.2 && behaviors.buildHut && instance.buildHut) {
        // 20% chance to build
        instance.buildHut();
      } else if (random < 0.5 && behaviors.wanderRange && instance.wander) {
        // 30% chance to wander
        instance.wander();
      } else {
        // 50% chance to just look around
        instance.lookAround();
      }
    } catch (error) {
      console.error(`[Everstream] Error in activity loop for ${bot.username}:`, error.message);
    }
  }, 15000); // Execute every 15 seconds
  
  // Health monitoring loop
  const healthInterval = setInterval(() => {
    if (instance.entity && instance.health !== undefined) {
      if (instance.health < 10) {
        console.log(`[Everstream] ${bot.username} health: ${instance.health}/20`);
      }
    }
  }, 30000); // Check every 30 seconds
  
  loopIntervals.push({ bot: bot.username, intervals: [activityInterval, healthInterval] });
}

/**
 * Stop all loops
 */
function stopScheduler() {
  console.log('[Everstream] Stopping all activity loops...');
  
  loopIntervals.forEach(item => {
    item.intervals.forEach(interval => clearInterval(interval));
  });
  
  loopIntervals = [];
}

module.exports = { startScheduler, stopScheduler };
