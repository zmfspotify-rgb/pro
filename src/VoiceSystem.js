/**
 * Voice System - Text-to-Speech with multiple voice models
 */

const say = require('say');

class VoiceSystem {
  constructor(config) {
    this.config = config;
    this.voiceProfiles = this.initializeVoiceProfiles();
    this.enabled = config.features && config.features.voiceEnabled;
  }

  initializeVoiceProfiles() {
    // Voice profiles with characteristics
    return {
      // Female voices
      female_1_soft: { voice: 'Victoria', rate: 0.9, pitch: 1.1 },
      female_2_energetic: { voice: 'Samantha', rate: 1.1, pitch: 1.2 },
      female_3_calm: { voice: 'Victoria', rate: 0.85, pitch: 1.0 },
      female_4_cheerful: { voice: 'Samantha', rate: 1.0, pitch: 1.15 },
      female_5_professional: { voice: 'Victoria', rate: 0.95, pitch: 1.0 },
      female_6_warm: { voice: 'Samantha', rate: 0.9, pitch: 1.05 },
      female_7_playful: { voice: 'Samantha', rate: 1.15, pitch: 1.25 },
      female_8_confident: { voice: 'Victoria', rate: 1.0, pitch: 1.08 },

      // Male voices
      male_1_deep: { voice: 'Alex', rate: 0.85, pitch: 0.85 },
      male_2_friendly: { voice: 'Alex', rate: 0.95, pitch: 1.0 },
      male_3_energetic: { voice: 'Alex', rate: 1.1, pitch: 1.05 },
      male_4_calm: { voice: 'Alex', rate: 0.85, pitch: 0.95 },
      male_5_professional: { voice: 'Alex', rate: 0.9, pitch: 0.98 },
      male_6_warm: { voice: 'Alex', rate: 0.9, pitch: 1.0 },
      male_7_enthusiastic: { voice: 'Alex', rate: 1.15, pitch: 1.1 },
      male_8_confident: { voice: 'Alex', rate: 1.0, pitch: 0.95 }
    };
  }

  speak(text, voiceModel = 'male_1_deep') {
    if (!this.enabled) {
      return;
    }

    const profile = this.voiceProfiles[voiceModel];
    
    if (!profile) {
      console.warn(`[VoiceSystem] Unknown voice model: ${voiceModel}, using default`);
      return;
    }

    console.log(`[VoiceSystem] Speaking with ${voiceModel}: "${text}"`);

    // Use the say library for TTS
    // Note: This requires platform-specific TTS engines
    // Windows: SAPI, macOS: say, Linux: espeak/festival
    try {
      say.speak(text, profile.voice, profile.rate, (err) => {
        if (err) {
          console.error(`[VoiceSystem] TTS error:`, err.message);
        }
      });
    } catch (error) {
      console.error(`[VoiceSystem] Failed to speak:`, error.message);
    }
  }

  getAvailableVoices() {
    return {
      female: Object.keys(this.voiceProfiles).filter(v => v.startsWith('female_')),
      male: Object.keys(this.voiceProfiles).filter(v => v.startsWith('male_'))
    };
  }

  testVoice(voiceModel) {
    const testPhrases = [
      "Hello! I'm an AI player in Minecraft.",
      "This is a test of the voice system.",
      "Welcome to the stream!"
    ];

    const phrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
    this.speak(phrase, voiceModel);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`[VoiceSystem] Voice system ${enabled ? 'enabled' : 'disabled'}`);
  }
}

module.exports = VoiceSystem;
