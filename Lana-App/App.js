import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pantalla principal con pestañas
import MainTabNavigator from './src/screens/MainTabNavigator';

// Pantallas iniciales
import HomeScreen from './src/screens/HomeScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import SupportScreen from './src/screens/SupportScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenida">
        {/* Pantallas iniciales */}
        <Stack.Screen name="Bienvenida" component={WelcomeScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RecuperarContraseña" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Main App con pestañas */}
        <Stack.Screen name="Principal" component={MainTabNavigator} options={{ headerShown: false }} />

        {/* Formularios secundarios */}
        <Stack.Screen name="NuevaTransacción" component={TransactionFormScreen} />
        <Stack.Screen name="ConfiguraciónNotificaciones" component={NotificationSettingsScreen} />
        <Stack.Screen name="AyudaYSoporte" component={SupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}