/**
 * Streaming Scheduler - Prevents stream overlaps
 */

class StreamScheduler {
  constructor(config) {
    this.config = config;
    this.activeStreams = new Set();
  }

  shouldStream(playerConfig) {
    if (!playerConfig.streamingSchedule || !playerConfig.streamingSchedule.enabled) {
      return false;
    }

    const now = new Date();
    const currentDay = this.getDayName(now.getDay());
    const currentTime = this.getTimeString(now);

    // Check if current day is in schedule
    if (!playerConfig.streamingSchedule.days.includes(currentDay)) {
      return false;
    }

    // Check if current time is within streaming window
    const startTime = playerConfig.streamingSchedule.startTime;
    const duration = playerConfig.streamingSchedule.duration; // in minutes
    const endTime = this.addMinutes(startTime, duration);

    if (this.isTimeInRange(currentTime, startTime, endTime)) {
      // Check if another bot is already streaming
      if (this.hasConflict(playerConfig.id)) {
        return false;
      }

      this.activeStreams.add(playerConfig.id);
      return true;
    } else {
      this.activeStreams.delete(playerConfig.id);
      return false;
    }
  }

  hasConflict(playerId) {
    // If any other player is currently streaming, there's a conflict
    for (const activeId of this.activeStreams) {
      if (activeId !== playerId) {
        return true;
      }
    }
    return false;
  }

  getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  getTimeString(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  addMinutes(timeString, minutes) {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  }

  isTimeInRange(currentTime, startTime, endTime) {
    return currentTime >= startTime && currentTime < endTime;
  }

  getScheduleForPlayer(playerConfig) {
    if (!playerConfig.streamingSchedule || !playerConfig.streamingSchedule.enabled) {
      return 'No schedule set';
    }

    const schedule = playerConfig.streamingSchedule;
    const days = schedule.days.join(', ');
    const duration = schedule.duration;

    return `${days} at ${schedule.startTime} for ${duration} minutes`;
  }

  getAllSchedules(players) {
    const schedules = [];

    for (const player of players) {
      schedules.push({
        username: player.username,
        schedule: this.getScheduleForPlayer(player)
      });
    }

    return schedules;
  }

  validateSchedules(players) {
    const conflicts = [];

    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const conflict = this.findConflict(players[i], players[j]);
        if (conflict) {
          conflicts.push(conflict);
        }
      }
    }

    return conflicts;
  }

  findConflict(player1, player2) {
    const schedule1 = player1.streamingSchedule;
    const schedule2 = player2.streamingSchedule;

    if (!schedule1 || !schedule2 || !schedule1.enabled || !schedule2.enabled) {
      return null;
    }

    // Check for overlapping days
    const commonDays = schedule1.days.filter(day => schedule2.days.includes(day));

    if (commonDays.length > 0) {
      // Check for overlapping times
      const end1 = this.addMinutes(schedule1.startTime, schedule1.duration);
      const end2 = this.addMinutes(schedule2.startTime, schedule2.duration);

      const overlap = this.timesOverlap(
        schedule1.startTime, end1,
        schedule2.startTime, end2
      );

      if (overlap) {
        return {
          player1: player1.username,
          player2: player2.username,
          days: commonDays,
          message: `Schedule conflict on ${commonDays.join(', ')}`
        };
      }
    }

    return null;
  }

  timesOverlap(start1, end1, start2, end2) {
    return (start1 < end2 && end1 > start2);
  }
}

module.exports = StreamScheduler;
