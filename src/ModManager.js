/**
 * Mod Manager - Handles client-side mods for AI players
 */

class ModManager {
  constructor(config, voiceSystem) {
    this.config = config;
    this.voiceSystem = voiceSystem;
    this.mods = new Map();
    this.enabled = config.mods?.enabled || false;
  }

  loadMods(bot, playerConfig) {
    if (!this.enabled) {
      console.log('[ModManager] Mods disabled');
      return;
    }

    console.log(`[ModManager] Loading mods for ${playerConfig.username}...`);

    // Load Simple Voice Chat mod
    if (this.config.mods.simpleVoiceChat?.enabled) {
      this.loadSimpleVoiceChatMod(bot, playerConfig);
    }
  }

  loadSimpleVoiceChatMod(bot, playerConfig) {
    console.log(`[${playerConfig.username}] Loading Simple Voice Chat mod...`);

    const modConfig = this.config.mods.simpleVoiceChat;
    
    const voiceChatMod = {
      name: 'SimpleVoiceChat',
      enabled: true,
      port: modConfig.port || 24454,
      voiceDistance: modConfig.voiceDistance || 48,
      useVoiceModel: modConfig.useVoiceModel !== false,
      allowPrivateChat: modConfig.allowPrivateChat !== false,
      privateChannels: new Map(),
      currentChannel: null,
      isMuted: false,

      // Speak using voice model
      speak: (message, isPrivate = false) => {
        const prefix = isPrivate ? '[Private] ' : '';
        console.log(`[${playerConfig.username}] ${prefix}Voice: ${message}`);

        if (voiceChatMod.useVoiceModel && this.voiceSystem) {
          this.voiceSystem.speak(message, playerConfig.voiceModel);
        }

        // Announce in chat if not private
        if (!isPrivate && bot.chat) {
          bot.chat(`🎤 ${message}`);
        }
      },

      // Create a private voice channel
      createPrivateChannel: (channelName, password = null) => {
        const channel = {
          name: channelName,
          password: password,
          members: [playerConfig.username],
          createdAt: new Date()
        };

        voiceChatMod.privateChannels.set(channelName, channel);
        console.log(`[${playerConfig.username}] Created private voice channel: ${channelName}`);
        
        if (password) {
          bot.chat(`Created password-protected voice channel: ${channelName}`);
        } else {
          bot.chat(`Created voice channel: ${channelName}`);
        }

        return channel;
      },

      // Join a private voice channel
      joinChannel: (channelName, password = null) => {
        const channel = voiceChatMod.privateChannels.get(channelName);
        
        if (!channel) {
          bot.chat(`Voice channel '${channelName}' not found!`);
          return false;
        }

        if (channel.password && channel.password !== password) {
          bot.chat('Incorrect password for voice channel!');
          return false;
        }

        if (!channel.members.includes(playerConfig.username)) {
          channel.members.push(playerConfig.username);
        }

        voiceChatMod.currentChannel = channelName;
        console.log(`[${playerConfig.username}] Joined voice channel: ${channelName}`);
        bot.chat(`Joined voice channel: ${channelName}`);
        
        return true;
      },

      // Leave current voice channel
      leaveChannel: () => {
        if (!voiceChatMod.currentChannel) {
          bot.chat('Not in any voice channel!');
          return;
        }

        const channel = voiceChatMod.privateChannels.get(voiceChatMod.currentChannel);
        if (channel) {
          const index = channel.members.indexOf(playerConfig.username);
          if (index > -1) {
            channel.members.splice(index, 1);
          }

          // Delete channel if empty
          if (channel.members.length === 0) {
            voiceChatMod.privateChannels.delete(voiceChatMod.currentChannel);
            console.log(`[${playerConfig.username}] Deleted empty voice channel: ${voiceChatMod.currentChannel}`);
          }
        }

        bot.chat(`Left voice channel: ${voiceChatMod.currentChannel}`);
        voiceChatMod.currentChannel = null;
      },

      // Whisper to a specific player
      whisper: (targetPlayer, message) => {
        console.log(`[${playerConfig.username}] Whisper to ${targetPlayer}: ${message}`);
        
        if (voiceChatMod.useVoiceModel && this.voiceSystem) {
          // Use a quieter/softer voice for whispers
          this.voiceSystem.speak(message, playerConfig.voiceModel);
        }

        // Send as private message in game
        if (bot.chat) {
          bot.chat(`/w ${targetPlayer} 🎤 ${message}`);
        }
      },

      // Toggle mute
      toggleMute: () => {
        voiceChatMod.isMuted = !voiceChatMod.isMuted;
        const status = voiceChatMod.isMuted ? 'muted' : 'unmuted';
        console.log(`[${playerConfig.username}] Voice chat ${status}`);
        bot.chat(`🎤 Voice chat ${status}`);
      },

      // Get voice chat info
      getInfo: () => {
        return {
          enabled: voiceChatMod.enabled,
          muted: voiceChatMod.isMuted,
          currentChannel: voiceChatMod.currentChannel,
          channelCount: voiceChatMod.privateChannels.size,
          voiceDistance: voiceChatMod.voiceDistance
        };
      }
    };

    // Setup chat commands for voice chat
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;

      // Voice chat commands
      const lowerMessage = message.toLowerCase();

      // !voice or !vc - Show voice chat info
      if (lowerMessage === '!voice' || lowerMessage === '!vc') {
        const info = voiceChatMod.getInfo();
        bot.chat(`Voice Chat - Distance: ${info.voiceDistance}m | Muted: ${info.isMuted ? 'Yes' : 'No'}`);
      }

      // !vmute - Toggle mute
      if (lowerMessage === '!vmute') {
        voiceChatMod.toggleMute();
      }

      // !vcreate <name> [password] - Create voice channel
      if (lowerMessage.startsWith('!vcreate ')) {
        const parts = message.split(' ');
        const channelName = parts[1];
        const password = parts[2] || null;
        
        if (channelName) {
          voiceChatMod.createPrivateChannel(channelName, password);
        }
      }

      // !vjoin <name> [password] - Join voice channel
      if (lowerMessage.startsWith('!vjoin ')) {
        const parts = message.split(' ');
        const channelName = parts[1];
        const password = parts[2] || null;
        
        if (channelName) {
          voiceChatMod.joinChannel(channelName, password);
        }
      }

      // !vleave - Leave voice channel
      if (lowerMessage === '!vleave') {
        voiceChatMod.leaveChannel();
      }

      // !vlist - List voice channels
      if (lowerMessage === '!vlist') {
        if (voiceChatMod.privateChannels.size === 0) {
          bot.chat('No voice channels available');
        } else {
          const channels = Array.from(voiceChatMod.privateChannels.keys()).join(', ');
          bot.chat(`Voice channels: ${channels}`);
        }
      }
    });

    // Proximity voice chat - speak when near other players
    bot.on('chat', (username, message) => {
      if (username === bot.username || voiceChatMod.isMuted) return;

      // Check if player is nearby for proximity voice
      const player = bot.players[username];
      if (player && player.entity && bot.entity) {
        const distance = bot.entity.position.distanceTo(player.entity.position);
        
        if (distance <= voiceChatMod.voiceDistance) {
          // Player is in voice range - can respond with voice
          if (Math.random() < 0.15) { // 15% chance to respond with voice
            const responses = [
              'I heard that!',
              'Good point!',
              'Interesting!',
              'I agree!',
              'Thanks for sharing!'
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            setTimeout(() => {
              voiceChatMod.speak(response, false);
            }, 500 + Math.random() * 1500);
          }
        }
      }
    });

    this.mods.set('simplevoicechat', voiceChatMod);
    console.log(`[${playerConfig.username}] Simple Voice Chat mod loaded (distance: ${voiceChatMod.voiceDistance}m)`);
  }

  getMod(name) {
    return this.mods.get(name);
  }

  getAllMods() {
    return Array.from(this.mods.values());
  }

  unloadMods() {
    this.mods.clear();
    console.log('[ModManager] All mods unloaded');
  }
}

module.exports = ModManager;
