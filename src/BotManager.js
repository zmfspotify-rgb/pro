/**
 * Bot Manager - Manages multiple AI players
 */

const AIPlayer = require('./AIPlayer');

class BotManager {
  constructor(config, streamScheduler, voiceSystem, chatHandler) {
    this.config = config;
    this.streamScheduler = streamScheduler;
    this.voiceSystem = voiceSystem;
    this.chatHandler = chatHandler;
    this.players = new Map();
  }

  async addPlayer(playerConfig) {
    if (this.players.has(playerConfig.id)) {
      console.log(`[BotManager] Player ${playerConfig.id} already exists`);
      return false;
    }

    const player = new AIPlayer(
      this.config,
      playerConfig,
      this.streamScheduler,
      this.voiceSystem,
      this.chatHandler
    );

    const connected = await player.connect();
    
    if (connected) {
      this.players.set(playerConfig.id, player);
      console.log(`[BotManager] Added player: ${playerConfig.username} (${playerConfig.id})`);
      return true;
    }

    return false;
  }

  removePlayer(playerId) {
    const player = this.players.get(playerId);
    
    if (player) {
      player.disconnect();
      this.players.delete(playerId);
      console.log(`[BotManager] Removed player: ${playerId}`);
      return true;
    }

    return false;
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  async startAll() {
    console.log(`[BotManager] Starting ${this.config.aiPlayers.length} AI players...`);
    
    for (const playerConfig of this.config.aiPlayers) {
      await this.addPlayer(playerConfig);
      // Add delay between connections to avoid overwhelming server
      await this.delay(2000);
    }
  }

  stopAll() {
    console.log(`[BotManager] Stopping all AI players...`);
    
    for (const [playerId, player] of this.players) {
      player.disconnect();
    }
    
    this.players.clear();
  }

  updateStreamingStatus() {
    for (const player of this.players.values()) {
      const shouldStream = this.streamScheduler.shouldStream(player.playerConfig);
      
      if (shouldStream && !player.isStreaming) {
        player.startStreaming();
      } else if (!shouldStream && player.isStreaming) {
        player.stopStreaming();
      }
    }
  }

  getStatus() {
    const status = {
      totalPlayers: this.players.size,
      activePlayers: 0,
      streamingPlayers: 0,
      players: []
    };

    for (const [playerId, player] of this.players) {
      if (player.isActive) status.activePlayers++;
      if (player.isStreaming) status.streamingPlayers++;
      
      status.players.push({
        id: playerId,
        username: player.playerConfig.username,
        active: player.isActive,
        streaming: player.isStreaming,
        voiceModel: player.playerConfig.voiceModel
      });
    }

    return status;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BotManager;
