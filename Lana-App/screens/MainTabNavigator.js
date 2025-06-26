import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import HomeScreen from './HomeScreen';
import TransactionManagementScreen from './TransactionManagementScreen';
import ChartsScreen from './ChartsScreen';
import NotificationCenterScreen from './NotificationCenterScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? '🏠' : '🏡';
          } else if (route.name === 'Transacciones') {
            iconName = focused ? '💳' : '🪙';
          } else if (route.name === 'Gráficas') {
            iconName = focused ? '📊' : '📈';
          } else if (route.name === 'Notificaciones') {
            iconName = focused ? '🔔' : ' Bell ';
          } else if (route.name === 'Perfil') {
            iconName = focused ? '🧑‍💼' : '🧑';
          }

          return <Text>{iconName}</Text>;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Transacciones" component={TransactionManagementScreen} />
      <Tab.Screen name="Gráficas" component={ChartsScreen} />
      <Tab.Screen name="Notificaciones" component={NotificationCenterScreen} />
      <Tab.Screen name="Perfil" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}