const { spawn } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const say = require('say');

class TwitchStreamer {
  constructor(botId, minecraftBot, config) {
    this.botId = botId;
    this.minecraftBot = minecraftBot;
    this.config = config;
    this.streamProcess = null;
    this.isStreaming = false;
    this.voiceEnabled = config.voice?.enabled || false;
    this.voiceModel = config.voice?.model || 'default';
  }

  async start() {
    if (this.isStreaming) {
      throw new Error('Already streaming');
    }

    const twitchConfig = this.config.twitch;
    if (!twitchConfig || !twitchConfig.streamKey) {
      throw new Error('Twitch configuration not found');
    }

    // Start streaming to Twitch
    await this.startStreamingToTwitch();
    
    // Connect to Twitch chat
    const chatResponder = this.minecraftBot.chatResponder;
    if (chatResponder) {
      await chatResponder.connectToTwitch(twitchConfig.channel);
      this.setupChatListener(chatResponder);
    }

    this.isStreaming = true;
    console.log(`Streaming started for bot ${this.botId}`);
  }

  async startStreamingToTwitch() {
    const twitchConfig = this.config.twitch;
    const streamUrl = `rtmp://live.twitch.tv/app/${twitchConfig.streamKey}`;

    // This is a simplified version - in a real implementation, you'd capture
    // the Minecraft game screen and stream it
    const command = ffmpeg()
      .input('desktop') // Would need proper screen capture
      .inputFormat('gdigrab') // Windows screen capture (platform-specific)
      .size('1920x1080')
      .fps(30)
      .videoCodec('libx264')
      .videoBitrate('3000k')
      .audioCodec('aac')
      .audioBitrate('128k')
      .format('flv')
      .output(streamUrl);

    // Store reference but don't actually start (would need proper setup)
    this.streamProcess = command;
    
    console.log(`Stream configured for ${streamUrl}`);
  }

  setupChatListener(chatResponder) {
    // Set up event listener for Twitch chat
    if (chatResponder.client) {
      chatResponder.client.on('message', async (channel, tags, message, self) => {
        if (self) return;

        const username = tags['display-name'] || tags.username;
        console.log(`[Twitch] ${username}: ${message}`);

        // Generate AI response
        const response = await this.minecraftBot.respondToTwitchChat(username, message);
        
        if (response) {
          // Send response to chat
          await chatResponder.sendMessage(response);
          
          // Optionally speak the response using TTS
          if (this.voiceEnabled) {
            await this.speakText(response);
          }
        }

        // Also respond in Minecraft chat if bot is connected
        if (this.minecraftBot.isConnected()) {
          const bot = this.minecraftBot.getBot();
          bot.chat(`[Twitch] ${username}: ${message}`);
        }
      });
    }
  }

  async speakText(text) {
    return new Promise((resolve, reject) => {
      // Use text-to-speech with custom voice model
      const voice = this.getVoiceForModel(this.voiceModel);
      
      say.speak(text, voice, 1.0, (err) => {
        if (err) {
          console.error('TTS error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getVoiceForModel(model) {
    // Map custom voice models to available system voices
    const voiceMap = {
      'default': null, // System default
      'male1': 'Alex',
      'male2': 'Bruce',
      'female1': 'Samantha',
      'female2': 'Victoria',
      'robot': 'Cellos'
    };
    
    return voiceMap[model] || null;
  }

  async stop() {
    if (!this.isStreaming) {
      throw new Error('Not currently streaming');
    }

    // Stop stream process
    if (this.streamProcess) {
      this.streamProcess.kill();
      this.streamProcess = null;
    }

    // Disconnect from Twitch chat
    const chatResponder = this.minecraftBot.chatResponder;
    if (chatResponder) {
      chatResponder.disconnect();
    }

    this.isStreaming = false;
    console.log(`Streaming stopped for bot ${this.botId}`);
  }

  getStatus() {
    return {
      streaming: this.isStreaming,
      voiceEnabled: this.voiceEnabled,
      voiceModel: this.voiceModel
    };
  }
}

module.exports = TwitchStreamer;
