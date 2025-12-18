const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

class ScheduleManager {
  constructor(botManager) {
    this.botManager = botManager;
    this.schedules = new Map();
    this.cronJobs = new Map();
    this.schedulePath = path.join(__dirname, '../config/schedules.json');
    this.loadSchedules();
  }

  loadSchedules() {
    try {
      if (fs.existsSync(this.schedulePath)) {
        const data = fs.readFileSync(this.schedulePath, 'utf8');
        const schedules = JSON.parse(data);
        
        for (const [botId, schedule] of Object.entries(schedules)) {
          this.schedules.set(botId, schedule);
        }
        
        console.log(`Loaded ${this.schedules.size} bot schedules`);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  }

  saveSchedules() {
    try {
      const schedulesObj = Object.fromEntries(this.schedules);
      const dir = path.dirname(this.schedulePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.schedulePath, JSON.stringify(schedulesObj, null, 2));
      console.log('Schedules saved');
    } catch (error) {
      console.error('Error saving schedules:', error);
    }
  }

  updateBotSchedule(botId, schedule) {
    // Validate schedule format
    if (!schedule.streaming || !Array.isArray(schedule.streaming)) {
      throw new Error('Invalid schedule format');
    }

    this.schedules.set(botId, schedule);
    this.saveSchedules();
    
    // Restart cron jobs for this bot
    this.stopBotCronJobs(botId);
    this.startBotCronJobs(botId, schedule);
    
    console.log(`Schedule updated for bot ${botId}`);
  }

  removeBotSchedule(botId) {
    this.stopBotCronJobs(botId);
    this.schedules.delete(botId);
    this.saveSchedules();
    
    console.log(`Schedule removed for bot ${botId}`);
  }

  getSchedule() {
    return Object.fromEntries(this.schedules);
  }

  getBotSchedule(botId) {
    return this.schedules.get(botId);
  }

  startBotCronJobs(botId, schedule) {
    const jobs = [];

    // Schedule streaming times
    for (const streamSlot of schedule.streaming) {
      const { cronExpression, duration } = streamSlot;
      
      // Start streaming job
      const startJob = cron.schedule(cronExpression, async () => {
        console.log(`[Schedule] Starting stream for bot ${botId}`);
        try {
          // Ensure bot is running
          if (!this.botManager.getBot(botId)) {
            await this.botManager.startBot(botId);
          }
          
          // Start streaming
          await this.botManager.startStreaming(botId);
          
          // Schedule stream stop using another cron job (more reliable than setTimeout)
          if (duration) {
            const stopTime = new Date(Date.now() + duration * 60 * 1000);
            const stopCronExpression = `${stopTime.getMinutes()} ${stopTime.getHours()} ${stopTime.getDate()} ${stopTime.getMonth() + 1} *`;
            
            const stopJob = cron.schedule(stopCronExpression, async () => {
              console.log(`[Schedule] Stopping stream for bot ${botId} after ${duration} minutes`);
              try {
                await this.botManager.stopStreaming(botId);
              } catch (error) {
                console.error(`Error stopping scheduled stream for bot ${botId}:`, error);
              }
              stopJob.stop();
            }, { scheduled: true });
            
            jobs.push(stopJob);
          }
        } catch (error) {
          console.error(`Error starting scheduled stream for bot ${botId}:`, error);
        }
      }, {
        scheduled: false
      });
      
      jobs.push(startJob);
    }

    // Schedule bot activities (non-streaming)
    if (schedule.activities) {
      for (const activity of schedule.activities) {
        const { cronExpression, task } = activity;
        
        const activityJob = cron.schedule(cronExpression, async () => {
          console.log(`[Schedule] Executing activity for bot ${botId}: ${task.type}`);
          try {
            const bot = this.botManager.getBot(botId);
            if (bot) {
              await bot.executeTask(task);
            }
          } catch (error) {
            console.error(`Error executing scheduled activity for bot ${botId}:`, error);
          }
        }, {
          scheduled: false
        });
        
        jobs.push(activityJob);
      }
    }

    this.cronJobs.set(botId, jobs);
  }

  stopBotCronJobs(botId) {
    const jobs = this.cronJobs.get(botId);
    if (jobs) {
      jobs.forEach(job => job.stop());
      this.cronJobs.delete(botId);
      console.log(`Stopped cron jobs for bot ${botId}`);
    }
  }

  start() {
    console.log('Starting schedule manager...');
    
    // Start cron jobs for all scheduled bots
    for (const [botId, schedule] of this.schedules) {
      this.startBotCronJobs(botId, schedule);
      
      // Start the jobs
      const jobs = this.cronJobs.get(botId);
      if (jobs) {
        jobs.forEach(job => job.start());
      }
    }
    
    console.log(`Schedule manager started with ${this.schedules.size} bot schedules`);
  }

  stop() {
    console.log('Stopping schedule manager...');
    
    for (const botId of this.cronJobs.keys()) {
      this.stopBotCronJobs(botId);
    }
    
    console.log('Schedule manager stopped');
  }
}

module.exports = ScheduleManager;
