const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const BotManager = require('./bot-manager');
const ScheduleManager = require('./schedule-manager');
const ConfigManager = require('./config-manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize managers
const botManager = new BotManager();
const scheduleManager = new ScheduleManager(botManager);
const configManager = new ConfigManager();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Bot Management Endpoints
app.get('/api/bots', (req, res) => {
  const bots = botManager.getAllBots();
  res.json({ bots });
});

app.post('/api/bots/start', async (req, res) => {
  try {
    const { botId } = req.body;
    await botManager.startBot(botId);
    res.json({ success: true, message: `Bot ${botId} started` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/bots/stop', async (req, res) => {
  try {
    const { botId } = req.body;
    await botManager.stopBot(botId);
    res.json({ success: true, message: `Bot ${botId} stopped` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/bots/:botId/status', (req, res) => {
  const { botId } = req.params;
  const status = botManager.getBotStatus(botId);
  res.json({ botId, status });
});

// Configuration Endpoints
app.get('/api/config', (req, res) => {
  const config = configManager.getConfig();
  res.json(config);
});

app.post('/api/config', (req, res) => {
  try {
    configManager.updateConfig(req.body);
    res.json({ success: true, message: 'Configuration updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule Endpoints
app.get('/api/schedule', (req, res) => {
  const schedule = scheduleManager.getSchedule();
  res.json({ schedule });
});

app.post('/api/schedule', (req, res) => {
  try {
    const { botId, schedule } = req.body;
    scheduleManager.updateBotSchedule(botId, schedule);
    res.json({ success: true, message: 'Schedule updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/schedule/:botId', (req, res) => {
  try {
    const { botId } = req.params;
    scheduleManager.removeBotSchedule(botId);
    res.json({ success: true, message: 'Schedule removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Streaming control
app.post('/api/bots/:botId/stream/start', async (req, res) => {
  try {
    const { botId } = req.params;
    await botManager.startStreaming(botId);
    res.json({ success: true, message: `Streaming started for bot ${botId}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/bots/:botId/stream/stop', async (req, res) => {
  try {
    const { botId } = req.params;
    await botManager.stopStreaming(botId);
    res.json({ success: true, message: `Streaming stopped for bot ${botId}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  scheduleManager.start(); // Start schedule monitoring
});

module.exports = app;
