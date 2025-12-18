const { Vec3 } = require('vec3');

/**
 * Initialize AI behaviors for a bot
 */
function initializeBehaviors(bot, behaviorConfig) {
  console.log(`[AI-Behaviors] Initializing behaviors for ${bot.username}`);
  
  let currentBehavior = null;
  
  // Chat response behavior
  if (behaviorConfig.chatResponses) {
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        bot.chat(`Hello ${username}!`);
      } else if (lowerMessage.includes('where are you')) {
        const pos = bot.entity.position;
        bot.chat(`I'm at ${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`);
      } else if (lowerMessage.includes('what are you doing')) {
        bot.chat(currentBehavior || 'Just exploring!');
      }
    });
  }
  
  // Build 3x3 hut behavior
  if (behaviorConfig.buildHut) {
    bot.buildHut = async function() {
      currentBehavior = 'Building a hut';
      console.log(`[AI-Behaviors] ${bot.username} starting hut building`);
      
      try {
        // Get dirt or cobblestone from inventory
        const buildBlock = bot.inventory.items().find(item => 
          item.name.includes('dirt') || 
          item.name.includes('cobblestone') ||
          item.name.includes('stone')
        );
        
        if (!buildBlock) {
          console.log(`[AI-Behaviors] ${bot.username} has no building blocks`);
          return;
        }
        
        const startPos = bot.entity.position.offset(2, 0, 2);
        
        // Build a simple 3x3 wall around the bot
        const positions = [
          // Front wall
          [0, 0, 0], [1, 0, 0], [2, 0, 0],
          [0, 1, 0], [1, 1, 0], [2, 1, 0],
          // Back wall
          [0, 0, 2], [1, 0, 2], [2, 0, 2],
          [0, 1, 2], [1, 1, 2], [2, 1, 2],
          // Left wall
          [0, 0, 1], [0, 1, 1],
          // Right wall
          [2, 0, 1], [2, 1, 1]
        ];
        
        for (const [x, y, z] of positions) {
          const blockPos = startPos.offset(x, y, z);
          
          try {
            await bot.equip(buildBlock, 'hand');
            
            // Check if block position is empty
            const block = bot.blockAt(blockPos);
            if (block && block.name === 'air') {
              // Find reference block to place against
              const refBlock = bot.blockAt(blockPos.offset(0, -1, 0));
              if (refBlock && refBlock.name !== 'air') {
                await bot.placeBlock(refBlock, new Vec3(0, 1, 0));
                await sleep(100);
              }
            }
          } catch (err) {
            // Continue even if placement fails
            console.log(`[AI-Behaviors] Block placement failed: ${err.message}`);
          }
        }
        
        console.log(`[AI-Behaviors] ${bot.username} completed hut building`);
        bot.chat('Hut construction complete!');
        currentBehavior = null;
      } catch (error) {
        console.error(`[AI-Behaviors] ${bot.username} hut building error:`, error.message);
        currentBehavior = null;
      }
    };
  }
  
  // Wander behavior
  if (behaviorConfig.wanderRange) {
    bot.wander = function() {
      currentBehavior = 'Wandering';
      
      const range = behaviorConfig.wanderRange;
      const spawnPos = bot.entity.position.clone();
      
      const randomPos = new Vec3(
        spawnPos.x + (Math.random() - 0.5) * range * 2,
        spawnPos.y,
        spawnPos.z + (Math.random() - 0.5) * range * 2
      );
      
      console.log(`[AI-Behaviors] ${bot.username} wandering to ${randomPos}`);
      
      bot.pathfinder?.setGoal(null);
      currentBehavior = null;
    };
  }
  
  // Idle behavior - look around
  bot.lookAround = function() {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI * 0.5;
    bot.look(yaw, pitch, false);
  };
  
  console.log(`[AI-Behaviors] Behaviors initialized for ${bot.username}`);
}

/**
 * Utility sleep function
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { initializeBehaviors };
