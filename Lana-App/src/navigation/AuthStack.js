// src/navigation/AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import PresupuestosScreen from '../screens/PresupuestosScreen';
import PresupuestoFormScreen from '../screens/PresupuestoFormScreen';
import PagosFijosScreen from '../screens/PagosFijosScreen';
import PagoFijoFormScreen from '../screens/PagoFijoFormScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{ headerBackTitle: 'Atrás' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Bienvenido' }} />
      <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Crear cuenta' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
      <Stack.Screen name="RecuperarContraseña" component={ForgotPasswordScreen} options={{ title: 'Recuperar contraseña' }} />
      <Stack.Screen name="Presupuestos" component={PresupuestosScreen} options={{ title: 'Presupuestos' }} />
      <Stack.Screen name="PresupuestoForm" component={PresupuestoFormScreen} options={{ title: 'Presupuesto' }} />
      <Stack.Screen name="PagosFijos" component={PagosFijosScreen} options={{ title: 'Pagos Fijos' }} />
      <Stack.Screen name="PagoFijoForm" component={PagoFijoFormScreen} options={{ title: 'Pago Fijo' }} />
    </Stack.Navigator>
  );
}