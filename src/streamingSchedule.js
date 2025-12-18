/**
 * Streaming Schedule Manager
 * Manages when bots should be online based on schedule
 */

export class StreamingSchedule {
  constructor() {
    this.schedules = new Map();
  }

  /**
   * Add a schedule for a bot
   * @param {string} botName - Name of the bot
   * @param {object} schedule - Schedule configuration
   */
  addSchedule(botName, schedule) {
    this.schedules.set(botName, {
      enabled: schedule.enabled !== false,
      days: schedule.days || [0, 1, 2, 3, 4, 5, 6], // 0 = Sunday
      timeRanges: schedule.timeRanges || [{ start: "00:00", end: "23:59" }],
      timezone: schedule.timezone || "UTC",
      mode: schedule.mode || "scheduled" // "scheduled", "always", "manual"
    });
  }

  /**
   * Check if a bot should be online right now
   * @param {string} botName - Name of the bot
   * @returns {boolean} True if bot should be online
   */
  shouldBeOnline(botName) {
    const schedule = this.schedules.get(botName);
    
    if (!schedule || !schedule.enabled) {
      return false;
    }

    // Always on mode
    if (schedule.mode === "always") {
      return true;
    }

    // Manual mode
    if (schedule.mode === "manual") {
      return false;
    }

    // Scheduled mode
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Check if current day is in schedule
    if (!schedule.days.includes(currentDay)) {
      return false;
    }

    // Check if current time is in any time range
    return schedule.timeRanges.some(range => {
      return currentTime >= range.start && currentTime <= range.end;
    });
  }

  /**
   * Get all bots that should be online
   * @returns {Array} Array of bot names that should be online
   */
  getOnlineBots() {
    const onlineBots = [];
    
    for (const [botName, schedule] of this.schedules.entries()) {
      if (this.shouldBeOnline(botName)) {
        onlineBots.push(botName);
      }
    }

    return onlineBots;
  }

  /**
   * Enable a bot's schedule
   */
  enableBot(botName) {
    const schedule = this.schedules.get(botName);
    if (schedule) {
      schedule.enabled = true;
    }
  }

  /**
   * Disable a bot's schedule
   */
  disableBot(botName) {
    const schedule = this.schedules.get(botName);
    if (schedule) {
      schedule.enabled = false;
    }
  }

  /**
   * Set bot to always-on mode (24/7)
   */
  setAlwaysOn(botName) {
    const schedule = this.schedules.get(botName);
    if (schedule) {
      schedule.mode = "always";
      schedule.enabled = true;
    }
  }

  /**
   * Export schedules for persistence
   */
  export() {
    const exported = {};
    for (const [botName, schedule] of this.schedules.entries()) {
      exported[botName] = schedule;
    }
    return exported;
  }

  /**
   * Import schedules from persistence
   */
  import(data) {
    this.schedules.clear();
    for (const [botName, schedule] of Object.entries(data)) {
      this.schedules.set(botName, schedule);
    }
  }
}

/**
 * Create a default 24/7 schedule
 */
export function create24x7Schedule() {
  return {
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    timeRanges: [{ start: "00:00", end: "23:59" }],
    mode: "always"
  };
}

/**
 * Create a peak hours schedule (typical streaming hours)
 */
export function createPeakHoursSchedule() {
  return {
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    timeRanges: [
      { start: "12:00", end: "16:00" }, // Afternoon
      { start: "18:00", end: "23:00" }  // Evening
    ],
    mode: "scheduled"
  };
}

/**
 * Create a weekday schedule
 */
export function createWeekdaySchedule() {
  return {
    enabled: true,
    days: [1, 2, 3, 4, 5], // Monday to Friday
    timeRanges: [{ start: "09:00", end: "17:00" }],
    mode: "scheduled"
  };
}

/**
 * Create a weekend schedule
 */
export function createWeekendSchedule() {
  return {
    enabled: true,
    days: [0, 6], // Sunday and Saturday
    timeRanges: [{ start: "10:00", end: "22:00" }],
    mode: "scheduled"
  };
}
