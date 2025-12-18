/**
 * Example Configuration File
 * Copy this to config.js and customize for your setup
 */

export default {
  // Minecraft Server Configuration
  server: {
    // For Aternos server: yourserver.aternos.me
    host: process.env.MC_HOST || 'localhost',
    port: parseInt(process.env.MC_PORT) || 25565,
    version: process.env.MC_VERSION || '1.20.1'
  },

  // Bot Configurations
  bots: [
    {
      username: 'Explorer_Bot',
      personalityType: 'explorer',
      voicePresetId: 'm3', // Young Explorer
      schedule: {
        enabled: true,
        mode: 'scheduled',
        days: [0, 1, 2, 3, 4, 5, 6],
        timeRanges: [
          { start: "12:00", end: "16:00" },
          { start: "18:00", end: "23:00" }
        ]
      }
    },
    {
      username: 'Builder_Bot',
      personalityType: 'builder',
      voicePresetId: 'f1', // Elegant Leader
      schedule: {
        enabled: true,
        mode: 'scheduled',
        days: [1, 2, 3, 4, 5], // Weekdays only
        timeRanges: [{ start: "09:00", end: "17:00" }]
      }
    },
    {
      username: 'Farmer_Bot',
      personalityType: 'farmer',
      voicePresetId: 'm8', // Casual Buddy
      schedule: {
        enabled: true,
        mode: 'always' // Always online
      }
    }
  ],

  // 24/7 AI Player Configuration
  keepAlive: {
    enabled: true,
    username: 'AI_ServerKeeper',
    personalityType: 'guardian'
  },

  // Feature Flags
  features: {
    autoStart: process.env.AUTO_START === 'true',
    enableMemoryPersistence: true,
    enableScheduleChecker: true,
    chatResponses: true
  }
};
