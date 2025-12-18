/**
 * Voice Model Presets
 * 16 voice presets: 8 male and 8 female
 * Each preset contains voice characteristics for text-to-speech or voice modulation
 */

export const voicePresets = {
  male: {
    m1: {
      name: "Deep Commander",
      pitch: 0.7,
      speed: 0.9,
      tone: "authoritative",
      description: "Deep, commanding voice with authority"
    },
    m2: {
      name: "Friendly Guide",
      pitch: 0.85,
      speed: 1.0,
      tone: "friendly",
      description: "Warm, approachable male voice"
    },
    m3: {
      name: "Young Explorer",
      pitch: 1.0,
      speed: 1.1,
      tone: "enthusiastic",
      description: "Energetic, youthful male voice"
    },
    m4: {
      name: "Wise Mentor",
      pitch: 0.75,
      speed: 0.85,
      tone: "calm",
      description: "Mature, experienced voice with wisdom"
    },
    m5: {
      name: "Action Hero",
      pitch: 0.9,
      speed: 1.05,
      tone: "confident",
      description: "Bold, confident action-oriented voice"
    },
    m6: {
      name: "Tech Expert",
      pitch: 0.95,
      speed: 1.15,
      tone: "analytical",
      description: "Precise, technical male voice"
    },
    m7: {
      name: "Storyteller",
      pitch: 0.88,
      speed: 0.95,
      tone: "dramatic",
      description: "Expressive, dramatic narrative voice"
    },
    m8: {
      name: "Casual Buddy",
      pitch: 0.92,
      speed: 1.0,
      tone: "relaxed",
      description: "Laid-back, friendly companion voice"
    }
  },
  female: {
    f1: {
      name: "Elegant Leader",
      pitch: 1.2,
      speed: 0.95,
      tone: "sophisticated",
      description: "Refined, authoritative female voice"
    },
    f2: {
      name: "Cheerful Friend",
      pitch: 1.3,
      speed: 1.05,
      tone: "upbeat",
      description: "Bright, cheerful female voice"
    },
    f3: {
      name: "Mysterious Sage",
      pitch: 1.15,
      speed: 0.9,
      tone: "mysterious",
      description: "Enigmatic, wise female voice"
    },
    f4: {
      name: "Adventurous Spirit",
      pitch: 1.25,
      speed: 1.1,
      tone: "adventurous",
      description: "Bold, adventurous female voice"
    },
    f5: {
      name: "Gentle Healer",
      pitch: 1.18,
      speed: 0.88,
      tone: "gentle",
      description: "Soothing, caring female voice"
    },
    f6: {
      name: "Tactical Strategist",
      pitch: 1.1,
      speed: 1.0,
      tone: "focused",
      description: "Sharp, strategic female voice"
    },
    f7: {
      name: "Energetic Performer",
      pitch: 1.35,
      speed: 1.15,
      tone: "energetic",
      description: "Dynamic, high-energy female voice"
    },
    f8: {
      name: "Calm Narrator",
      pitch: 1.12,
      speed: 0.92,
      tone: "serene",
      description: "Peaceful, narrative female voice"
    }
  }
};

/**
 * Get a voice preset by ID
 * @param {string} presetId - The preset ID (e.g., 'm1', 'f3')
 * @returns {object|null} The voice preset or null if not found
 */
export function getVoicePreset(presetId) {
  const gender = presetId.startsWith('m') ? 'male' : 'female';
  return voicePresets[gender]?.[presetId] || null;
}

/**
 * List all available voice presets
 * @returns {Array} Array of all voice presets with their IDs
 */
export function listVoicePresets() {
  const presets = [];
  
  Object.entries(voicePresets.male).forEach(([id, preset]) => {
    presets.push({ id, gender: 'male', ...preset });
  });
  
  Object.entries(voicePresets.female).forEach(([id, preset]) => {
    presets.push({ id, gender: 'female', ...preset });
  });
  
  return presets;
}

/**
 * Get random voice preset
 * @param {string} gender - Optional gender filter ('male' or 'female')
 * @returns {object} Random voice preset
 */
export function getRandomVoicePreset(gender = null) {
  let availablePresets;
  
  if (gender === 'male') {
    availablePresets = Object.entries(voicePresets.male);
  } else if (gender === 'female') {
    availablePresets = Object.entries(voicePresets.female);
  } else {
    availablePresets = [
      ...Object.entries(voicePresets.male),
      ...Object.entries(voicePresets.female)
    ];
  }
  
  const [id, preset] = availablePresets[Math.floor(Math.random() * availablePresets.length)];
  return { id, ...preset };
}
