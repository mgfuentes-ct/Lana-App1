import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas existentes
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import NotificationCenterScreen from './screens/NotificationCenterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './screens/DashboardScreen';
import TransactionFormScreen from './screens/TransactionFormScreen';
import ChartsScreen from './screens/ChartsScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenida">
        <Stack.Screen name="Bienvenida" component={WelcomeScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Notificaciones" component={NotificationCenterScreen} />
        <Stack.Screen name="RecuperarContraseña" component={ForgotPasswordScreen} />
        <Stack.Screen name="PanelPrincipal" component={DashboardScreen} />
        <Stack.Screen name="NuevaTransacción" component={TransactionFormScreen} />
        <Stack.Screen name="Gráficas" component={ChartsScreen} />
        <Stack.Screen name="DetalleTransacción" component={TransactionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}