// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth / Tabs
import AuthStack from './src/navigation/AuthStack';
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Provider de autenticación
import { AuthProvider } from './src/hooks/useAuth';

// Pantallas independientes que ya tenías
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import SupportScreen from './src/screens/SupportScreen';
import UpcomingPaymentsScreen from './src/screens/UpcomingPaymentsScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import EditDeleteTransactionScreen from './src/screens/EditDeleteTransactionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// ✅ Formularios NUEVOS (para que funcionen los botones +Nuevo)
import PresupuestoFormScreen from './src/screens/PresupuestoFormScreen';
import PagoFijoFormScreen from './src/screens/PagoFijoFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
          {/* Flujo de autenticación */}
          <Stack.Screen name="Auth" component={AuthStack} />

          {/* Tabs principales */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* ------ Pantallas secundarias (con header) ------ */}
          <Stack.Screen
            name="NuevaTransacción"
            component={TransactionFormScreen}
            options={{ headerShown: true, title: 'Nueva Transacción' }}
          />
          <Stack.Screen
            name="ConfiguraciónNotificaciones"
            component={NotificationSettingsScreen}
            options={{ headerShown: true, title: 'Notificaciones' }}
          />
          <Stack.Screen
            name="Soporte"
            component={SupportScreen}
            options={{ headerShown: true, title: 'Soporte' }}
          />
          <Stack.Screen
            name="UpcomingPayments"
            component={UpcomingPaymentsScreen}
            options={{ headerShown: true, title: 'Próximos Pagos' }}
          />
          <Stack.Screen
            name="DetalleTransacción"
            component={TransactionDetailScreen}
            options={{ headerShown: true, title: 'Detalle de Transacción' }}
          />
          <Stack.Screen
            name="EditarEliminarTransacción"
            component={EditDeleteTransactionScreen}
            options={{ headerShown: true, title: 'Editar/Eliminar Transacción' }}
          />
          <Stack.Screen
            name="RecuperarContraseña"
            component={ForgotPasswordScreen}
            options={{ headerShown: true, title: 'Recuperar Contraseña' }}
          />

          {/* ------ NUEVOS formularios para Presupuestos / Pagos Fijos ------ */}
          <Stack.Screen
            name="PresupuestoForm"
            component={PresupuestoFormScreen}
            options={{ headerShown: true, title: 'Presupuesto' }}
          />
          <Stack.Screen
            name="PagoFijoForm"
            component={PagoFijoFormScreen}
            options={{ headerShown: true, title: 'Pago Fijo' }}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
