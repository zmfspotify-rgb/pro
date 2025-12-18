const chalk = require('chalk');

function displayBanner() {
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎮  Minecraft Content Pipeline Manager  🎮             ║
║                                                           ║
║   Multi-bot Minecraft content pipeline powered by Node.js║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
}

function clearScreen() {
  // Clear console - try multiple methods for compatibility
  console.clear();
  // Fallback for terminals that don't support console.clear()
  if (process.stdout.isTTY) {
    // ANSI escape sequence for clearing screen - widely supported
    process.stdout.write('\x1Bc');
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function logInfo(message) {
  console.log(chalk.blue('[INFO]'), message);
}

function logSuccess(message) {
  console.log(chalk.green('[SUCCESS]'), message);
}

function logWarning(message) {
  console.log(chalk.yellow('[WARNING]'), message);
}

function logError(message) {
  console.log(chalk.red('[ERROR]'), message);
}

module.exports = {
  displayBanner,
  clearScreen,
  formatDate,
  logInfo,
  logSuccess,
  logWarning,
  logError
};
