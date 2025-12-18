const tmi = require('tmi.js');

/**
 * Initialize Twitch chat listener
 */
function initTwitchChat(config, bots) {
  if (!config.enabled) {
    console.log('[Twitch-Chat] Twitch integration disabled');
    return null;
  }
  
  console.log('[Twitch-Chat] Initializing Twitch chat...');
  
  const client = new tmi.Client({
    options: { debug: false },
    identity: {
      username: config.botUsername,
      password: config.oauth
    },
    channels: [config.channel]
  });
  
  client.connect().catch(err => {
    console.error('[Twitch-Chat] Connection error:', err.message);
  });
  
  client.on('connected', (address, port) => {
    console.log(`[Twitch-Chat] Connected to ${address}:${port}`);
  });
  
  client.on('message', (channel, tags, message, self) => {
    if (self) return;
    
    console.log(`[Twitch-Chat] ${tags['display-name']}: ${message}`);
    
    // Handle commands
    handleTwitchCommand(message, tags, bots, client, channel);
  });
  
  client.on('error', (err) => {
    console.error('[Twitch-Chat] Error:', err.message);
  });
  
  return client;
}

/**
 * Handle Twitch chat commands
 */
function handleTwitchCommand(message, tags, bots, client, channel) {
  const lowerMessage = message.toLowerCase().trim();
  
  // !status - Get bot status
  if (lowerMessage === '!status') {
    const status = bots.map(bot => {
      const connected = bot.instance && bot.instance.entity ? '✅' : '❌';
      return `${bot.username}: ${connected}`;
    }).join(' | ');
    
    client.say(channel, `Bot Status: ${status}`);
  }
  
  // !bots - List all bots
  else if (lowerMessage === '!bots') {
    const botList = bots.map(bot => bot.username).join(', ');
    client.say(channel, `Active bots: ${botList}`);
  }
  
  // !say <message> - Make all bots say something
  else if (lowerMessage.startsWith('!say ')) {
    const text = message.substring(5);
    bots.forEach(bot => {
      if (bot.instance && bot.instance.entity) {
        bot.instance.chat(text);
      }
    });
    client.say(channel, `Bots saying: "${text}"`);
  }
  
  // !location - Get bot locations
  else if (lowerMessage === '!location') {
    const locations = bots.map(bot => {
      if (bot.instance && bot.instance.entity) {
        const pos = bot.instance.entity.position;
        return `${bot.username}: (${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)})`;
      }
      return `${bot.username}: offline`;
    }).join(' | ');
    
    client.say(channel, locations);
  }
  
  // !build - Trigger build behavior
  else if (lowerMessage === '!build') {
    bots.forEach(bot => {
      if (bot.instance && bot.instance.buildHut) {
        bot.instance.buildHut();
      }
    });
    client.say(channel, 'Building huts...');
  }
  
  // !help - Show available commands
  else if (lowerMessage === '!help') {
    client.say(channel, 'Commands: !status, !bots, !location, !say <message>, !build, !help');
  }
}

module.exports = { initTwitchChat };
