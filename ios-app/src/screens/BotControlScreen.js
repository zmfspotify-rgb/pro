import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ApiService from '../services/ApiService';

export default function BotControlScreen({ route, navigation }) {
  const { botId } = route.params;
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, [botId]);

  const loadStatus = async () => {
    try {
      const data = await ApiService.getBotStatus(botId);
      setStatus(data.status);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleStartBot = async () => {
    setLoading(true);
    try {
      await ApiService.startBot(botId);
      Alert.alert('Success', `Bot ${botId} started`);
      await loadStatus();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async () => {
    Alert.alert(
      'Confirm',
      `Stop bot ${botId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await ApiService.stopBot(botId);
              Alert.alert('Success', `Bot ${botId} stopped`);
              await loadStatus();
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleStartStreaming = async () => {
    setLoading(true);
    try {
      await ApiService.startStreaming(botId);
      Alert.alert('Success', `Streaming started for ${botId}`);
      await loadStatus();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopStreaming = async () => {
    setLoading(true);
    try {
      await ApiService.stopStreaming(botId);
      Alert.alert('Success', `Streaming stopped for ${botId}`);
      await loadStatus();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.title}>{botId}</Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, { color: status.running ? '#4CAF50' : '#F44336' }]}>
            {status.running ? 'Running' : 'Stopped'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Connected:</Text>
          <Text style={styles.value}>{status.connected ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Streaming:</Text>
          <Text style={[styles.value, { color: status.streaming ? '#4CAF50' : '#666' }]}>
            {status.streaming ? 'Yes' : 'No'}
          </Text>
        </View>

        {status.currentTask && (
          <View style={styles.statusRow}>
            <Text style={styles.label}>Current Task:</Text>
            <Text style={styles.value}>{status.currentTask.type}</Text>
          </View>
        )}
      </View>

      <View style={styles.controlsCard}>
        <Text style={styles.sectionTitle}>Bot Controls</Text>
        
        {!status.running ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartBot}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>▶️ Start Bot</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopBot}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>⏹️ Stop Bot</Text>
            )}
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Streaming Controls</Text>
        
        {!status.streaming ? (
          <TouchableOpacity
            style={[styles.button, styles.streamButton, !status.running && styles.disabledButton]}
            onPress={handleStartStreaming}
            disabled={loading || !status.running}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>📹 Start Streaming</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopStreaming}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>⏹️ Stop Streaming</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  controlsCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
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
    marginTop: 8,
    color: '#333',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  streamButton: {
    backgroundColor: '#9C27B0',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
