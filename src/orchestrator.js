/**
 * AISMP Bot Orchestrator
 * Manages bot assignments, scheduling, and fallback strategies
 */

/**
 * Bot Orchestrator class - manages bot-channel assignments
 */
export class BotOrchestrator {
  constructor(config) {
    this.config = config;
    this.assignments = new Map();
    this.botStatus = new Map();
    
    // Initialize bot status
    config.bots.forEach((bot, id) => {
      this.botStatus.set(id, {
        available: true,
        activeChannels: [],
        lastHealthCheck: Date.now()
      });
    });
  }

  /**
   * Assign a bot to a channel
   * @param {string} channelId - Channel ID to assign bot to
   * @returns {object} Assignment result
   */
  assignBot(channelId) {
    const channel = this.config.channels.get(channelId);
    if (!channel) {
      throw new Error(`Channel not found: ${channelId}`);
    }

    // Find the route for this channel
    const route = this.config.routes.find(r => r.channelId === channelId);
    if (!route) {
      throw new Error(`No route found for channel: ${channelId}`);
    }

    // Try primary bots first
    for (const botInfo of route.primaryBots) {
      const bot = this.config.bots.get(botInfo.id);
      const status = this.botStatus.get(botInfo.id);
      
      if (this.canAssignBot(bot, status, channel)) {
        return this.performAssignment(botInfo.id, channelId, 'primary');
      }
    }

    // Try fallback bots
    for (const botInfo of route.fallbackBots) {
      const bot = this.config.bots.get(botInfo.id);
      const status = this.botStatus.get(botInfo.id);
      
      if (this.canAssignBot(bot, status, channel)) {
        return this.performAssignment(botInfo.id, channelId, 'fallback');
      }
    }

    // Try backup bots from primary bots
    for (const botInfo of route.primaryBots) {
      const bot = this.config.bots.get(botInfo.id);
      for (const backupBotId of bot.backupBots) {
        const backupBot = this.config.bots.get(backupBotId);
        const backupStatus = this.botStatus.get(backupBotId);
        
        if (backupBot && this.canAssignBot(backupBot, backupStatus, channel)) {
          return this.performAssignment(backupBotId, channelId, 'backup');
        }
      }
    }

    return {
      success: false,
      channelId,
      botId: null,
      message: 'No available bot found for channel'
    };
  }

  /**
   * Check if a bot can be assigned to a channel
   * @param {object} bot - Bot object
   * @param {object} status - Bot status
   * @param {object} channel - Channel object
   * @returns {boolean} True if bot can be assigned
   */
  canAssignBot(bot, status, channel) {
    if (!status.available) {
      return false;
    }

    // Check if bot supports the platform
    if (!bot.platforms.includes(channel.platform)) {
      return false;
    }

    // Check capabilities
    const hasCapabilities = channel.requiredCapabilities.every(cap =>
      bot.capabilities.includes(cap)
    );
    if (!hasCapabilities) {
      return false;
    }

    // Check schedule
    if (!this.isWithinSchedule(bot.schedule)) {
      return false;
    }

    // Check role limits (solo bots can only handle one channel)
    if (bot.role === 'solo' && status.activeChannels.length > 0) {
      return false;
    }

    return true;
  }

  /**
   * Check if current time is within bot's schedule
   * @param {object} schedule - Bot schedule
   * @returns {boolean} True if within schedule
   */
  isWithinSchedule(schedule) {
    const now = new Date();
    
    // Check day of week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];
    
    if (!schedule.days.includes(currentDay)) {
      return false;
    }

    // Check time range
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (currentTime < schedule.activeHours.start || currentTime > schedule.activeHours.end) {
      return false;
    }

    return true;
  }

  /**
   * Perform the actual bot assignment
   * @param {string} botId - Bot ID
   * @param {string} channelId - Channel ID
   * @param {string} assignmentType - Type of assignment (primary/fallback/backup)
   * @returns {object} Assignment result
   */
  performAssignment(botId, channelId, assignmentType) {
    const status = this.botStatus.get(botId);
    const channel = this.config.channels.get(channelId);
    
    // Update channel assignment
    channel.assignedBot = botId;
    
    // Update bot status
    status.activeChannels.push(channelId);
    
    // Store assignment
    this.assignments.set(channelId, {
      botId,
      channelId,
      assignedAt: Date.now(),
      assignmentType
    });

    return {
      success: true,
      channelId,
      botId,
      assignmentType,
      message: `Bot ${botId} assigned to channel ${channelId} (${assignmentType})`
    };
  }

  /**
   * Unassign a bot from a channel
   * @param {string} channelId - Channel ID
   * @returns {object} Unassignment result
   */
  unassignBot(channelId) {
    const assignment = this.assignments.get(channelId);
    if (!assignment) {
      return {
        success: false,
        message: `No assignment found for channel ${channelId}`
      };
    }

    const botId = assignment.botId;
    const status = this.botStatus.get(botId);
    const channel = this.config.channels.get(channelId);

    // Remove channel from bot's active channels
    status.activeChannels = status.activeChannels.filter(id => id !== channelId);
    
    // Clear channel assignment
    channel.assignedBot = null;
    
    // Remove assignment record
    this.assignments.delete(channelId);

    return {
      success: true,
      channelId,
      botId,
      message: `Bot ${botId} unassigned from channel ${channelId}`
    };
  }

  /**
   * Get all current assignments
   * @returns {Array} Array of assignment objects
   */
  getAssignments() {
    return Array.from(this.assignments.values());
  }

  /**
   * Get bot status
   * @param {string} botId - Bot ID
   * @returns {object} Bot status
   */
  getBotStatus(botId) {
    const bot = this.config.bots.get(botId);
    const status = this.botStatus.get(botId);
    
    if (!bot || !status) {
      return null;
    }

    return {
      id: botId,
      name: bot.name,
      role: bot.role,
      available: status.available,
      activeChannels: status.activeChannels,
      lastHealthCheck: status.lastHealthCheck
    };
  }

  /**
   * Set bot availability
   * @param {string} botId - Bot ID
   * @param {boolean} available - Availability status
   */
  setBotAvailability(botId, available) {
    const status = this.botStatus.get(botId);
    if (status) {
      status.available = available;
      status.lastHealthCheck = Date.now();
    }
  }

  /**
   * Get all available bots
   * @returns {Array} Array of available bot objects
   */
  getAvailableBots() {
    const available = [];
    
    this.config.bots.forEach((bot, id) => {
      const status = this.botStatus.get(id);
      if (status.available) {
        available.push({
          id,
          name: bot.name,
          role: bot.role,
          platforms: bot.platforms,
          activeChannels: status.activeChannels.length
        });
      }
    });

    return available;
  }
}

export default BotOrchestrator;
