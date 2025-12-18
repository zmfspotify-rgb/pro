import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  constructor() {
    // Default to localhost, but will be overridden by saved URL
    // Users should configure this in the Settings screen
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    this.loadBaseURL();
  }

  async loadBaseURL() {
    try {
      const savedURL = await AsyncStorage.getItem('serverURL');
      if (savedURL) {
        this.baseURL = savedURL;
      }
    } catch (error) {
      console.error('Failed to load server URL:', error);
    }
  }

  async setBaseURL(url) {
    this.baseURL = url;
    try {
      await AsyncStorage.setItem('serverURL', url);
    } catch (error) {
      console.error('Failed to save server URL:', error);
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getBots() {
    const response = await axios.get(`${this.baseURL}/api/bots`);
    return response.data;
  }

  async startBot(botId) {
    const response = await axios.post(`${this.baseURL}/api/bots/start`, {
      botId,
    });
    return response.data;
  }

  async stopBot(botId) {
    const response = await axios.post(`${this.baseURL}/api/bots/stop`, {
      botId,
    });
    return response.data;
  }

  async getBotStatus(botId) {
    const response = await axios.get(`${this.baseURL}/api/bots/${botId}/status`);
    return response.data;
  }

  async startStreaming(botId) {
    const response = await axios.post(
      `${this.baseURL}/api/bots/${botId}/stream/start`
    );
    return response.data;
  }

  async stopStreaming(botId) {
    const response = await axios.post(
      `${this.baseURL}/api/bots/${botId}/stream/stop`
    );
    return response.data;
  }

  async getConfig() {
    const response = await axios.get(`${this.baseURL}/api/config`);
    return response.data;
  }

  async updateConfig(config) {
    const response = await axios.post(`${this.baseURL}/api/config`, config);
    return response.data;
  }

  async getSchedule() {
    const response = await axios.get(`${this.baseURL}/api/schedule`);
    return response.data;
  }

  async updateSchedule(botId, schedule) {
    const response = await axios.post(`${this.baseURL}/api/schedule`, {
      botId,
      schedule,
    });
    return response.data;
  }

  async deleteSchedule(botId) {
    const response = await axios.delete(
      `${this.baseURL}/api/schedule/${botId}`
    );
    return response.data;
  }
}

export default new ApiService();
