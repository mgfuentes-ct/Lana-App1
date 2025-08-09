// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar AuthStack
import AuthStack from './src/navigation/AuthStack';
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Pantallas independientes (formularios)
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import SupportScreen from './src/screens/SupportScreen';
import UpcomingPaymentsScreen from './src/screens/UpcomingPaymentsScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import EditDeleteTransactionScreen from './src/screens/EditDeleteTransactionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        
        {/* Formularios secundarios */}
        <Stack.Screen name="NuevaTransacción" component={TransactionFormScreen} options={{ title: 'Nueva Transacción' }} />
        <Stack.Screen name="ConfiguraciónNotificaciones" component={NotificationSettingsScreen} options={{ title: 'Notificaciones' }} />
        <Stack.Screen name="Soporte" component={SupportScreen} options={{ title: 'Soporte' }} />
        <Stack.Screen name="UpcomingPayments" component={UpcomingPaymentsScreen} options={{ title: 'Próximos Pagos' }} />
        <Stack.Screen name="DetalleTransacción" component={TransactionDetailScreen} options={{ title: 'Detalle de Transacción' }} />
        <Stack.Screen name="EditarEliminarTransacción" component={EditDeleteTransactionScreen} options={{ title: 'Editar/Eliminar Transacción' }} />
        <Stack.Screen name="RecuperarContraseña" component={ForgotPasswordScreen} options={{ title: 'Recuperar Contraseña' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}