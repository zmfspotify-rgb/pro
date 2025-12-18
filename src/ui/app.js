const { ipcRenderer } = require('electron');

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.bots = [];
    this.schedule = [];
    this.logs = [];
    this.confirmCallback = null;
    this.init();
  }

  async init() {
    this.setupNavigation();
    this.setupModals();
    this.setupBotManagement();
    this.setupScheduleManagement();
    this.setupLogs();
    this.setupSettings();
    this.setupEventListeners();
    this.setupNotifications();
    
    await this.loadData();
    this.updateDashboard();
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        this.switchView(view);
      });
    });
  }

  switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      }
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');

    this.currentView = viewName;

    // Refresh view data
    if (viewName === 'dashboard') {
      this.updateDashboard();
    } else if (viewName === 'bots') {
      this.renderBots();
    } else if (viewName === 'schedule') {
      this.renderSchedule();
    } else if (viewName === 'logs') {
      this.renderLogs();
    }
  }

  setupModals() {
    // Add Bot Modal
    const addBotModal = document.getElementById('add-bot-modal');
    const addBotBtn = document.getElementById('add-bot-btn');
    const cancelBotBtn = document.getElementById('cancel-bot-btn');
    const closeBtns = document.querySelectorAll('.close-btn');

    addBotBtn.addEventListener('click', () => {
      addBotModal.classList.add('show');
    });

    cancelBotBtn.addEventListener('click', () => {
      addBotModal.classList.remove('show');
      this.clearBotForm();
    });

    // Add Schedule Modal
    const addScheduleModal = document.getElementById('add-schedule-modal');
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    const cancelScheduleBtn = document.getElementById('cancel-schedule-btn');

    addScheduleBtn.addEventListener('click', () => {
      this.populateBotSelect();
      addScheduleModal.classList.add('show');
    });

    cancelScheduleBtn.addEventListener('click', () => {
      addScheduleModal.classList.remove('show');
      this.clearScheduleForm();
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        addBotModal.classList.remove('show');
        addScheduleModal.classList.remove('show');
      });
    });

    // Close on background click
    [addBotModal, addScheduleModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });
  }

  setupBotManagement() {
    const saveBotBtn = document.getElementById('save-bot-btn');
    saveBotBtn.addEventListener('click', async () => {
      await this.saveBot();
    });
  }

  setupScheduleManagement() {
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    saveScheduleBtn.addEventListener('click', async () => {
      await this.saveSchedule();
    });
  }

  setupLogs() {
    const clearLogsBtn = document.getElementById('clear-logs-btn');
    clearLogsBtn.addEventListener('click', () => {
      this.logs = [];
      this.renderLogs();
    });

    const logBotFilter = document.getElementById('log-bot-filter');
    logBotFilter.addEventListener('change', () => {
      this.renderLogs();
    });
  }

  setupSettings() {
    const autoStartCheckbox = document.getElementById('auto-start-scheduled');
    const notificationsCheckbox = document.getElementById('enable-notifications');

    autoStartCheckbox.checked = localStorage.getItem('auto-start-scheduled') === 'true';
    notificationsCheckbox.checked = localStorage.getItem('enable-notifications') === 'true';

    autoStartCheckbox.addEventListener('change', (e) => {
      localStorage.setItem('auto-start-scheduled', e.target.checked);
    });

    notificationsCheckbox.addEventListener('change', (e) => {
      localStorage.setItem('enable-notifications', e.target.checked);
    });
  }

  setupNotifications() {
    // Setup confirmation modal
    const confirmModal = document.getElementById('confirm-modal');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const confirmOkBtn = document.getElementById('confirm-ok-btn');
    const confirmCloseBtns = confirmModal.querySelectorAll('.close-btn');

    confirmCancelBtn.addEventListener('click', () => {
      confirmModal.classList.remove('show');
      if (this.confirmCallback) {
        this.confirmCallback(false);
        this.confirmCallback = null;
      }
    });

    confirmOkBtn.addEventListener('click', () => {
      confirmModal.classList.remove('show');
      if (this.confirmCallback) {
        this.confirmCallback(true);
        this.confirmCallback = null;
      }
    });

    confirmCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        confirmModal.classList.remove('show');
        if (this.confirmCallback) {
          this.confirmCallback(false);
          this.confirmCallback = null;
        }
      });
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${this.escapeHtml(message)}</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 4000);
  }

  showConfirm(title, message, callback) {
    const confirmModal = document.getElementById('confirm-modal');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    this.confirmCallback = callback;
    confirmModal.classList.add('show');
  }

  setupEventListeners() {
    // Listen for bot status changes
    ipcRenderer.on('bot-status-changed', (event, data) => {
      const bot = this.bots.find(b => b.id === data.botId);
      if (bot) {
        bot.status = data.status;
        this.renderBots();
        this.updateDashboard();
      }
    });

    // Listen for bot logs
    ipcRenderer.on('bot-log', (event, data) => {
      this.logs.push({
        botId: data.botId,
        ...data.log
      });
      
      // Keep only last 500 logs in UI
      if (this.logs.length > 500) {
        this.logs.shift();
      }
      
      if (this.currentView === 'logs') {
        this.renderLogs();
      }
    });
  }

  async loadData() {
    try {
      this.bots = await ipcRenderer.invoke('get-bots');
      this.schedule = await ipcRenderer.invoke('get-schedule');
      this.updateBotFilter();
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async saveBot() {
    const name = document.getElementById('bot-name').value.trim();
    const username = document.getElementById('bot-username').value.trim();
    const password = document.getElementById('bot-password').value.trim();
    const server = document.getElementById('bot-server').value.trim();
    const port = parseInt(document.getElementById('bot-port').value);
    const alwaysOn = document.getElementById('bot-always-on').checked;
    const autoReconnect = document.getElementById('bot-auto-reconnect').checked;

    if (!name || !username || !server) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }

    const result = await ipcRenderer.invoke('add-bot', {
      name,
      username,
      password,
      server,
      port,
      alwaysOn,
      autoReconnect
    });

    if (result.success) {
      await this.loadData();
      this.renderBots();
      this.updateDashboard();
      document.getElementById('add-bot-modal').classList.remove('show');
      this.clearBotForm();
      this.showToast('Bot added successfully!', 'success');
    } else {
      this.showToast('Failed to add bot: ' + result.error, 'error');
    }
  }

  clearBotForm() {
    document.getElementById('bot-name').value = '';
    document.getElementById('bot-username').value = '';
    document.getElementById('bot-password').value = '';
    document.getElementById('bot-server').value = '';
    document.getElementById('bot-port').value = '25565';
    document.getElementById('bot-always-on').checked = false;
    document.getElementById('bot-auto-reconnect').checked = true;
  }

  async saveSchedule() {
    const botId = document.getElementById('schedule-bot').value;
    const startTime = document.getElementById('schedule-start-time').value;
    const endTime = document.getElementById('schedule-end-time').value;
    const dayCheckboxes = document.querySelectorAll('.days-selector input[type="checkbox"]');
    const days = Array.from(dayCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => parseInt(cb.value));

    if (!botId || days.length === 0) {
      this.showToast('Please select a bot and at least one day', 'error');
      return;
    }

    const scheduleItem = {
      id: Date.now().toString(),
      botId,
      days,
      startTime,
      endTime,
      enabled: true
    };

    this.schedule.push(scheduleItem);
    await ipcRenderer.invoke('update-schedule', this.schedule);
    
    await this.loadData();
    this.renderSchedule();
    document.getElementById('add-schedule-modal').classList.remove('show');
    this.clearScheduleForm();
    this.showToast('Schedule created successfully!', 'success');
  }

  clearScheduleForm() {
    document.getElementById('schedule-start-time').value = '09:00';
    document.getElementById('schedule-end-time').value = '17:00';
    document.querySelectorAll('.days-selector input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
  }

  populateBotSelect() {
    const select = document.getElementById('schedule-bot');
    select.innerHTML = '';
    
    this.bots.forEach(bot => {
      const option = document.createElement('option');
      option.value = bot.id;
      option.textContent = bot.name;
      select.appendChild(option);
    });
  }

  updateBotFilter() {
    const select = document.getElementById('log-bot-filter');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="all">All Bots</option>';
    
    this.bots.forEach(bot => {
      const option = document.createElement('option');
      option.value = bot.id;
      option.textContent = bot.name;
      select.appendChild(option);
    });
    
    select.value = currentValue;
  }

  renderBots() {
    const grid = document.getElementById('bots-grid');
    
    if (this.bots.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="icon">🤖</div>
          <p>No bots added yet. Click "Add Bot" to get started!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    
    this.bots.forEach(bot => {
      const card = document.createElement('div');
      card.className = 'bot-card';
      
      const statusClass = `status-${bot.status}`;
      const statusText = bot.status.charAt(0).toUpperCase() + bot.status.slice(1);
      
      card.innerHTML = `
        <div class="bot-header">
          <div class="bot-name">${this.escapeHtml(bot.name)}</div>
          <div class="bot-status ${statusClass}">${statusText}</div>
        </div>
        <div class="bot-info">
          <div><strong>Username:</strong> ${this.escapeHtml(bot.username)}</div>
          <div><strong>Server:</strong> ${this.escapeHtml(bot.server)}:${bot.port}</div>
          ${bot.alwaysOn ? '<span class="bot-badge">⚡ Always On</span>' : ''}
          ${bot.autoReconnect ? '<span class="bot-badge">🔄 Auto Reconnect</span>' : ''}
        </div>
        <div class="bot-actions">
          ${bot.status === 'offline' 
            ? '<button class="btn btn-success start-btn" data-bot-id="' + bot.id + '">▶️ Start</button>'
            : '<button class="btn btn-danger stop-btn" data-bot-id="' + bot.id + '">⏹️ Stop</button>'
          }
          <button class="btn btn-secondary edit-btn" data-bot-id="${bot.id}">✏️</button>
          <button class="btn btn-danger remove-btn" data-bot-id="${bot.id}">🗑️</button>
        </div>
      `;
      
      grid.appendChild(card);
    });

    // Add event listeners
    grid.querySelectorAll('.start-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const botId = btn.getAttribute('data-bot-id');
        await ipcRenderer.invoke('start-bot', botId);
      });
    });

    grid.querySelectorAll('.stop-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const botId = btn.getAttribute('data-bot-id');
        await ipcRenderer.invoke('stop-bot', botId);
      });
    });

    grid.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const botId = btn.getAttribute('data-bot-id');
        const bot = this.bots.find(b => b.id === botId);
        const botName = bot ? bot.name : 'this bot';
        
        this.showConfirm(
          'Remove Bot',
          `Are you sure you want to remove ${botName}?`,
          async (confirmed) => {
            if (confirmed) {
              await ipcRenderer.invoke('remove-bot', botId);
              await this.loadData();
              this.renderBots();
              this.updateDashboard();
              this.showToast('Bot removed successfully', 'success');
            }
          }
        );
      });
    });

    grid.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const botId = btn.getAttribute('data-bot-id');
        const bot = this.bots.find(b => b.id === botId);
        if (bot) {
          const alwaysOn = !bot.alwaysOn;
          await ipcRenderer.invoke('update-bot', botId, { alwaysOn });
          await this.loadData();
          this.renderBots();
        }
      });
    });
  }

  renderSchedule() {
    const list = document.getElementById('schedule-list');
    
    if (this.schedule.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="icon">📅</div>
          <p>No schedules created yet. Click "Add Schedule" to create one!</p>
        </div>
      `;
      return;
    }

    list.innerHTML = '';
    
    this.schedule.forEach(item => {
      const bot = this.bots.find(b => b.id === item.botId);
      if (!bot) return;

      const scheduleDiv = document.createElement('div');
      scheduleDiv.className = 'schedule-item';
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daysText = item.days.map(d => dayNames[d]).join(', ');
      
      scheduleDiv.innerHTML = `
        <div class="schedule-header">
          <div class="schedule-bot-name">${this.escapeHtml(bot.name)}</div>
          <button class="btn btn-danger remove-schedule-btn" data-schedule-id="${item.id}">Remove</button>
        </div>
        <div class="schedule-details">
          <div><strong>Days:</strong> ${daysText}</div>
          <div><strong>Time:</strong> ${item.startTime} - ${item.endTime}</div>
        </div>
      `;
      
      list.appendChild(scheduleDiv);
    });

    // Add remove handlers
    list.querySelectorAll('.remove-schedule-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const scheduleId = btn.getAttribute('data-schedule-id');
        this.schedule = this.schedule.filter(s => s.id !== scheduleId);
        await ipcRenderer.invoke('update-schedule', this.schedule);
        await this.loadData();
        this.renderSchedule();
      });
    });
  }

  renderLogs() {
    const container = document.getElementById('logs-container');
    const filter = document.getElementById('log-bot-filter').value;
    
    const filteredLogs = filter === 'all' 
      ? this.logs 
      : this.logs.filter(log => log.botId === filter);

    if (filteredLogs.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No logs to display</p></div>';
      return;
    }

    container.innerHTML = '';
    
    filteredLogs.forEach(log => {
      const logDiv = document.createElement('div');
      logDiv.className = `log-entry ${log.level}`;
      
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      const bot = this.bots.find(b => b.id === log.botId);
      const botName = bot ? bot.name : 'Unknown';
      
      logDiv.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span>[${botName}]</span>
        ${this.escapeHtml(log.message)}
      `;
      
      container.appendChild(logDiv);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  updateDashboard() {
    const totalBots = this.bots.length;
    const onlineBots = this.bots.filter(b => b.status === 'online').length;
    const offlineBots = this.bots.filter(b => b.status === 'offline').length;
    const scheduledBots = this.schedule.length;

    document.getElementById('total-bots').textContent = totalBots;
    document.getElementById('online-bots').textContent = onlineBots;
    document.getElementById('offline-bots').textContent = offlineBots;
    document.getElementById('scheduled-bots').textContent = scheduledBots;

    // Render active bots list
    const activeBotsList = document.getElementById('active-bots-list');
    const activeBots = this.bots.filter(b => b.status === 'online');

    if (activeBots.length === 0) {
      activeBotsList.innerHTML = `
        <div class="empty-state">
          <p>No active bots</p>
        </div>
      `;
    } else {
      activeBotsList.innerHTML = '';
      activeBots.forEach(bot => {
        const item = document.createElement('div');
        item.className = 'bot-list-item';
        item.innerHTML = `
          <div class="bot-list-info">
            <h4>${this.escapeHtml(bot.name)}</h4>
            <p>${this.escapeHtml(bot.server)}:${bot.port}</p>
          </div>
          <div class="bot-status status-online">Online</div>
        `;
        activeBotsList.appendChild(item);
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
