// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Pantallas existentes
import HomeScreen from '../screens/HomeScreen';
import TransactionManagementScreen from '../screens/TransactionManagementScreen';
import ChartsScreen from '../screens/ChartsScreen';
import NotificationCenterScreen from '../screens/NotificationCenterScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

// NUEVAS listas (ya creadas antes)
import PresupuestosScreen from '../screens/PresupuestosScreen';
import PagosFijosScreen from '../screens/PagosFijosScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-vertical' : 'swap-vertical-outline';
          } else if (route.name === 'Charts') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Presupuestos') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'PagosFijos') {
            iconName = focused ? 'repeat' : 'repeat-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#35619eff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60 + bottom,
          paddingBottom: bottom,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Transactions" component={TransactionManagementScreen} options={{ title: 'Transacciones' }} />
      <Tab.Screen name="Charts" component={ChartsScreen} options={{ title: 'Gráficas' }} />
      {/* NUEVAS TABS */}
      <Tab.Screen name="Presupuestos" component={PresupuestosScreen} options={{ title: 'Presupuestos' }} />
      <Tab.Screen name="PagosFijos" component={PagosFijosScreen} options={{ title: 'Pagos Fijos' }} />
      {/* Fin nuevas tabs */}
      <Tab.Screen name="Notifications" component={NotificationCenterScreen} options={{ title: 'Notificaciones' }} />
      <Tab.Screen name="Profile" component={UserProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
