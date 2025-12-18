import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import ApiService from '../services/ApiService';

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBot, setSelectedBot] = useState('');
  const [bots, setBots] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    streaming: [],
    activities: [],
  });
  const [cronExpression, setCronExpression] = useState('');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    loadSchedules();
    loadBots();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await ApiService.getSchedule();
      setSchedules(data.schedule || {});
    } catch (error) {
      Alert.alert('Error', 'Failed to load schedules: ' + error.message);
    }
  };

  const loadBots = async () => {
    try {
      const data = await ApiService.getBots();
      setBots(data.bots || []);
    } catch (error) {
      console.error('Failed to load bots:', error);
    }
  };

  const handleAddStreamSlot = () => {
    if (!cronExpression) {
      Alert.alert('Error', 'Please enter a cron expression');
      return;
    }

    const streamSlot = {
      cronExpression,
      duration: parseInt(duration, 10),
    };

    setNewSchedule({
      ...newSchedule,
      streaming: [...newSchedule.streaming, streamSlot],
    });

    setCronExpression('');
    setDuration('60');
  };

  const handleSaveSchedule = async () => {
    if (!selectedBot) {
      Alert.alert('Error', 'Please select a bot');
      return;
    }

    try {
      await ApiService.updateSchedule(selectedBot, newSchedule);
      Alert.alert('Success', 'Schedule saved successfully');
      setModalVisible(false);
      setNewSchedule({ streaming: [], activities: [] });
      await loadSchedules();
    } catch (error) {
      Alert.alert('Error', 'Failed to save schedule: ' + error.message);
    }
  };

  const handleDeleteSchedule = async (botId) => {
    Alert.alert(
      'Confirm Delete',
      `Delete schedule for ${botId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.deleteSchedule(botId);
              Alert.alert('Success', 'Schedule deleted');
              await loadSchedules();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const openAddModal = (botId) => {
    setSelectedBot(botId);
    const existingSchedule = schedules[botId] || { streaming: [], activities: [] };
    setNewSchedule(existingSchedule);
    setModalVisible(true);
  };

  const renderScheduleItem = ({ item: botId }) => {
    const schedule = schedules[botId];
    if (!schedule) return null;

    return (
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.botName}>{botId}</Text>
          <View style={styles.scheduleActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openAddModal(botId)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSchedule(botId)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Stream Times:</Text>
        {schedule.streaming && schedule.streaming.length > 0 ? (
          schedule.streaming.map((slot, index) => (
            <View key={index} style={styles.slotItem}>
              <Text style={styles.slotText}>⏰ {slot.cronExpression}</Text>
              <Text style={styles.slotDuration}>Duration: {slot.duration} min</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSlotsText}>No stream times scheduled</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>➕ Add Schedule</Text>
      </TouchableOpacity>

      <FlatList
        data={Object.keys(schedules)}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No schedules configured</Text>
            <Text style={styles.emptySubtext}>Tap + to add a schedule</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Schedule</Text>

            <Text style={styles.label}>Select Bot:</Text>
            <View style={styles.botSelector}>
              {bots.map((bot) => (
                <TouchableOpacity
                  key={bot.id}
                  style={[
                    styles.botOption,
                    selectedBot === bot.id && styles.botOptionSelected,
                  ]}
                  onPress={() => setSelectedBot(bot.id)}
                >
                  <Text
                    style={[
                      styles.botOptionText,
                      selectedBot === bot.id && styles.botOptionTextSelected,
                    ]}
                  >
                    {bot.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Add Stream Time:</Text>
            <TextInput
              style={styles.input}
              placeholder="Cron Expression (e.g., 0 14 * * *)"
              value={cronExpression}
              onChangeText={setCronExpression}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addSlotButton}
              onPress={handleAddStreamSlot}
            >
              <Text style={styles.addSlotButtonText}>Add Time Slot</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Current Stream Times:</Text>
            {newSchedule.streaming.map((slot, index) => (
              <View key={index} style={styles.slotPreview}>
                <Text style={styles.slotText}>
                  {slot.cronExpression} ({slot.duration} min)
                </Text>
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveSchedule}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleCard: {
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#2196F3',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
  slotItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  slotText: {
    fontSize: 14,
    color: '#333',
  },
  slotDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  noSlotsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  botSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  botOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  botOptionSelected: {
    backgroundColor: '#2196F3',
  },
  botOptionText: {
    color: '#2196F3',
  },
  botOptionTextSelected: {
    color: '#fff',
  },
  addSlotButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addSlotButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  slotPreview: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
