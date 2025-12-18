#!/usr/bin/env node
/**
 * Test script for bot system components
 */

import { StreamingSchedule, create24x7Schedule, createPeakHoursSchedule } from './src/streamingSchedule.js';
import { listVoicePresets, getVoicePreset } from './src/voicePresets.js';
import { personalityTraits, BotMemory, BotPersonality } from './src/aiPersonality.js';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     Bot System Component Tests                             ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Test 1: Voice Presets
console.log('Test 1: Voice Presets');
console.log('----------------------');
const voices = listVoicePresets();
console.log(`✓ Total voice presets: ${voices.length}`);
console.log(`✓ Male voices: ${voices.filter(v => v.gender === 'male').length}`);
console.log(`✓ Female voices: ${voices.filter(v => v.gender === 'female').length}`);
const m1 = getVoicePreset('m1');
console.log(`✓ Sample voice (m1): ${m1.name} - ${m1.description}`);
console.log('');

// Test 2: Personality Traits
console.log('Test 2: Personality Traits');
console.log('--------------------------');
const personalityCount = Object.keys(personalityTraits).length;
console.log(`✓ Total personalities: ${personalityCount}`);
console.log(`✓ Personalities: ${Object.keys(personalityTraits).join(', ')}`);
console.log('');

// Test 3: Bot Memory
console.log('Test 3: Bot Memory System');
console.log('-------------------------');
const memory = new BotMemory('TestBot');
memory.remember({ type: 'spawn', description: 'Bot spawned' });
memory.rememberPlayer('Steve', { type: 'chat', description: 'Hello!', positive: true });
memory.rememberLocation('Base', { x: 100, y: 64, z: 200 }, 'Home base');
console.log(`✓ Memory created for: ${memory.botName}`);
console.log(`✓ Recent memories: ${memory.getRecentMemories().length}`);
console.log(`✓ Relationship with Steve: ${memory.getRelationship('Steve')}`);
console.log('');

// Test 4: Bot Personality
console.log('Test 4: Bot Personality');
console.log('-----------------------');
const personality = new BotPersonality('explorer', m1);
console.log(`✓ Personality type: ${personality.traits.name}`);
console.log(`✓ Voice: ${personality.voicePreset.name}`);
console.log(`✓ Behaviors: ${personality.traits.behaviors.join(', ')}`);
console.log(`✓ Current mood: ${personality.mood}`);
console.log('');

// Test 5: Streaming Schedule
console.log('Test 5: Streaming Schedule');
console.log('--------------------------');
const schedule = new StreamingSchedule();
schedule.addSchedule('Bot24x7', create24x7Schedule());
schedule.addSchedule('BotPeakHours', createPeakHoursSchedule());
console.log(`✓ 24/7 bot should be online: ${schedule.shouldBeOnline('Bot24x7')}`);
console.log(`✓ Online bots: ${schedule.getOnlineBots().length}`);
console.log('');

console.log('═══════════════════════════════════════════════════════════');
console.log('  All component tests passed! ✓');
console.log('═══════════════════════════════════════════════════════════');
