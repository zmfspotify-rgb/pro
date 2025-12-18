import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import BotControlScreen from './src/screens/BotControlScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Bot Launcher' }}
        />
        <Stack.Screen 
          name="BotControl" 
          component={BotControlScreen} 
          options={{ title: 'Control Bot' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
        <Stack.Screen 
          name="Schedule" 
          component={ScheduleScreen} 
          options={{ title: 'Stream Schedule' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
