const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const BotManager = require('./src/botManager');

let mainWindow;
let botManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#1a1a2e',
    frame: true,
    title: 'Minecraft Bot Manager Pro'
  });

  mainWindow.loadFile('src/ui/index.html');
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  botManager = new BotManager();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-bots', async () => {
  return botManager.getBots();
});

ipcMain.handle('add-bot', async (event, botConfig) => {
  return botManager.addBot(botConfig);
});

ipcMain.handle('remove-bot', async (event, botId) => {
  return botManager.removeBot(botId);
});

ipcMain.handle('start-bot', async (event, botId) => {
  return botManager.startBot(botId);
});

ipcMain.handle('stop-bot', async (event, botId) => {
  return botManager.stopBot(botId);
});

ipcMain.handle('update-bot', async (event, botId, updates) => {
  return botManager.updateBot(botId, updates);
});

ipcMain.handle('get-schedule', async () => {
  return botManager.getSchedule();
});

ipcMain.handle('update-schedule', async (event, schedule) => {
  return botManager.updateSchedule(schedule);
});

ipcMain.handle('get-logs', async (event, botId) => {
  return botManager.getLogs(botId);
});

// Forward bot status updates to renderer
function sendToRenderer(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

// Set up event forwarding after botManager is created
app.whenReady().then(() => {
  botManager.on('bot-status-changed', (data) => {
    sendToRenderer('bot-status-changed', data);
  });

  botManager.on('bot-log', (data) => {
    sendToRenderer('bot-log', data);
  });
});
