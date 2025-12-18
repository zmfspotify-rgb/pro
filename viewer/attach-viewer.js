const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

/**
 * Attach Prismarine viewer to a bot
 */
function attachViewer(bot, port) {
  try {
    console.log(`[Viewer] Attaching viewer for ${bot.username} on port ${port}...`);
    
    const viewer = mineflayerViewer(bot, { 
      port: port,
      firstPerson: true
    });
    
    bot.once('spawn', () => {
      console.log(`[Viewer] Viewer ready for ${bot.username} at http://localhost:${port}`);
    });
    
    return viewer;
  } catch (error) {
    console.error(`[Viewer] Error attaching viewer for ${bot.username}:`, error.message);
    return null;
  }
}

module.exports = { attachViewer };
