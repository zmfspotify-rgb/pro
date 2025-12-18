import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import ApiService from '../services/ApiService';

export default function SettingsScreen() {
  const [config, setConfig] = useState({
    minecraft: {
      host: 'localhost',
      port: '25565',
      version: '1.19',
    },
    twitch: {
      channel: '',
      streamKey: '',
      oauth: '',
    },
    voice: {
      enabled: true,
      model: 'default',
    },
  });
  const [loading, setLoading] = useState(false);
  const [newBotId, setNewBotId] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await ApiService.getConfig();
      setConfig(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load config: ' + error.message);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await ApiService.updateConfig(config);
      Alert.alert('Success', 'Configuration saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save config: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMinecraftConfig = (key, value) => {
    setConfig({
      ...config,
      minecraft: {
        ...config.minecraft,
        [key]: value,
      },
    });
  };

  const updateTwitchConfig = (key, value) => {
    setConfig({
      ...config,
      twitch: {
        ...config.twitch,
        [key]: value,
      },
    });
  };

  const updateVoiceConfig = (key, value) => {
    setConfig({
      ...config,
      voice: {
        ...config.voice,
        [key]: value,
      },
    });
  };

  const handleAddBot = () => {
    if (!newBotId.trim()) {
      Alert.alert('Error', 'Please enter a bot ID');
      return;
    }

    const updatedConfig = {
      ...config,
      bots: [...(config.bots || []), newBotId.trim()],
    };

    setConfig(updatedConfig);
    setNewBotId('');
    Alert.alert('Success', `Bot ${newBotId} added. Don't forget to save!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Server Connection</Text>
        <TextInput
          style={styles.input}
          placeholder="Server URL"
          value={ApiService.baseURL}
          onChangeText={(value) => ApiService.setBaseURL(value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minecraft Server</Text>
        <TextInput
          style={styles.input}
          placeholder="Host"
          value={config.minecraft.host}
          onChangeText={(value) => updateMinecraftConfig('host', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Port"
          value={config.minecraft.port}
          keyboardType="numeric"
          onChangeText={(value) => updateMinecraftConfig('port', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Version (e.g., 1.19)"
          value={config.minecraft.version}
          onChangeText={(value) => updateMinecraftConfig('version', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Twitch Configuration</Text>
        <TextInput
          style={styles.input}
          placeholder="Channel Name"
          value={config.twitch.channel}
          onChangeText={(value) => updateTwitchConfig('channel', value)}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Stream Key"
          value={config.twitch.streamKey}
          onChangeText={(value) => updateTwitchConfig('streamKey', value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="OAuth Token"
          value={config.twitch.oauth}
          onChangeText={(value) => updateTwitchConfig('oauth', value)}
          secureTextEntry
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Settings</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable Voice:</Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              config.voice.enabled ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={() => updateVoiceConfig('enabled', !config.voice.enabled)}
          >
            <Text style={styles.toggleText}>
              {config.voice.enabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Voice Model (default, male1, female1, etc.)"
          value={config.voice.model}
          onChangeText={(value) => updateVoiceConfig('model', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Bot</Text>
        <View style={styles.addBotContainer}>
          <TextInput
            style={[styles.input, styles.addBotInput]}
            placeholder="Bot ID (e.g., bot1)"
            value={newBotId}
            onChangeText={setNewBotId}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddBot}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {config.bots && config.bots.length > 0 && (
          <View style={styles.botsList}>
            <Text style={styles.label}>Current Bots:</Text>
            {config.bots.map((botId) => (
              <Text key={botId} style={styles.botItem}>
                • {botId}
              </Text>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Configuration'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  toggle: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  toggleOn: {
    backgroundColor: '#4CAF50',
  },
  toggleOff: {
    backgroundColor: '#BDBDBD',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addBotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBotInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botsList: {
    marginTop: 12,
  },
  botItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
