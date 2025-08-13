// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tabs con tus listas
import MainTabNavigator from './MainTabNavigator';

// Formularios (crear/editar)
import PresupuestoFormScreen from '../screens/PresupuestoFormScreen';
import PagoFijoFormScreen from '../screens/PagoFijoFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* Root: tus tabs */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />

      {/* 👇 IMPORTANTE: estas rutas deben EXISTIR porque las usa el botón "+ Nuevo" */}
      <Stack.Screen
        name="PresupuestoForm"
        component={PresupuestoFormScreen}
        options={{ title: 'Presupuesto' }}
      />
      <Stack.Screen
        name="PagoFijoForm"
        component={PagoFijoFormScreen}
        options={{ title: 'Pago Fijo' }}
      />
    </Stack.Navigator>
  );
}
