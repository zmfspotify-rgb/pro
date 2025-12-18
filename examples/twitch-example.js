/**
 * Example: Twitch Chat Integration
 * This script demonstrates how to use Twitch chat features
 */

const { initTwitchChat } = require('../channels/twitch-chat');

async function exampleTwitchChat() {
  console.log('Example: Twitch Chat Integration');
  console.log('=================================\n');
  
  // Mock bot configuration
  const bots = [
    {
      username: 'Bot1',
      instance: {
        entity: { position: { x: 100, y: 64, z: 200 } },
        chat: (msg) => console.log(`Bot1 says: ${msg}`),
        buildHut: () => console.log('Bot1 is building a hut')
      },
      viewerPort: 3000
    },
    {
      username: 'Bot2',
      instance: {
        entity: { position: { x: 150, y: 64, z: 250 } },
        chat: (msg) => console.log(`Bot2 says: ${msg}`),
        buildHut: () => console.log('Bot2 is building a hut')
      },
      viewerPort: 3001
    }
  ];
  
  // Example configuration
  const twitchConfig = {
    enabled: false, // Set to true and add credentials to test
    channel: 'your_channel',
    botUsername: 'your_bot',
    oauth: 'oauth:your_token_here'
  };
  
  console.log('Configuration:', twitchConfig);
  console.log('\nAvailable commands:');
  console.log('  !status - Check bot connection status');
  console.log('  !bots - List all active bots');
  console.log('  !location - Get bot positions');
  console.log('  !say <message> - Make bots say something');
  console.log('  !build - Trigger building behavior');
  console.log('  !help - Show available commands');
  
  console.log('\nNote: Set enabled:true and provide valid credentials to connect');
  
  // Initialize (will not connect if enabled is false)
  const client = initTwitchChat(twitchConfig, bots);
  
  if (client) {
    console.log('\nTwitch chat client initialized');
  } else {
    console.log('\nTwitch integration is disabled');
  }
}

// Run if executed directly
if (require.main === module) {
  exampleTwitchChat().catch(console.error);
}

module.exports = { exampleTwitchChat };
