import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import ApiService from '../services/ApiService';

export default function HomeScreen({ navigation }) {
  const [bots, setBots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    loadBots();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await ApiService.checkHealth();
      setServerConnected(connected);
    } catch (error) {
      setServerConnected(false);
    }
  };

  const loadBots = async () => {
    try {
      const data = await ApiService.getBots();
      setBots(data.bots || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bots: ' + error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkConnection();
    await loadBots();
    setRefreshing(false);
  };

  const getBotStatusColor = (bot) => {
    if (bot.running && bot.streaming) return '#4CAF50';
    if (bot.running) return '#2196F3';
    return '#9E9E9E';
  };

  const getBotStatusText = (bot) => {
    if (bot.running && bot.streaming) return 'Streaming';
    if (bot.running) return 'Running';
    return 'Stopped';
  };

  const renderBot = ({ item }) => (
    <TouchableOpacity
      style={styles.botCard}
      onPress={() => navigation.navigate('BotControl', { botId: item.id })}
    >
      <View style={styles.botHeader}>
        <Text style={styles.botName}>{item.id}</Text>
        <View style={[styles.statusIndicator, { backgroundColor: getBotStatusColor(item) }]} />
      </View>
      <Text style={styles.botStatus}>{getBotStatusText(item)}</Text>
      {item.currentTask && (
        <Text style={styles.botTask}>Current task: {item.currentTask.type}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.connectionStatus}>
          <View
            style={[
              styles.connectionDot,
              { backgroundColor: serverConnected ? '#4CAF50' : '#F44336' }
            ]}
          />
          <Text style={styles.connectionText}>
            {serverConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={() => navigation.navigate('Schedule')}
      >
        <Text style={styles.scheduleButtonText}>📅 Manage Schedules</Text>
      </TouchableOpacity>

      <FlatList
        data={bots}
        renderItem={renderBot}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bots configured</Text>
            <Text style={styles.emptySubtext}>Add bots in Settings</Text>
          </View>
        }
        contentContainerStyle={bots.length === 0 ? styles.emptyList : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  scheduleButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botCard: {
    backgroundColor: '#fff',
    margin: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  botStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  botTask: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});
