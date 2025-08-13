// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Importar AuthStack
import AuthStack from './src/navigation/AuthStack';
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Importar el provider de autenticación
import { AuthProvider, useAuth } from './src/hooks/useAuth';

// Pantallas independientes (formularios)
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import SupportScreen from './src/screens/SupportScreen';
import UpcomingPaymentsScreen from './src/screens/UpcomingPaymentsScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import EditDeleteTransactionScreen from './src/screens/EditDeleteTransactionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

// Componente que maneja la lógica de navegación basada en autenticación
function NavigationContent() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🧭 NavigationContent - Estado de autenticación:', { isAuthenticated, isLoading });

  // Mostrar loading mientras se verifica el estado de autenticación
  if (isLoading) {
    console.log('⏳ Mostrando loading...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35619eff" />
      </View>
    );
  }

  console.log('🎯 Navegando a:', isAuthenticated ? 'Main' : 'Auth');
  console.log('📍 Ruta seleccionada:', isAuthenticated ? 'MainTabNavigator' : 'AuthStack (Welcome)');

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "Main" : "Auth"}>
      {isAuthenticated ? (
        // Usuario autenticado - mostrar pantalla principal
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      ) : (
        // Usuario no autenticado - mostrar pantallas de auth
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      )}
      
      {/* Formularios secundarios */}
      <Stack.Screen name="NuevaTransacción" component={TransactionFormScreen} options={{ title: 'Nueva Transacción' }} />
      <Stack.Screen name="ConfiguraciónNotificaciones" component={NotificationSettingsScreen} options={{ title: 'Notificaciones' }} />
      <Stack.Screen name="Soporte" component={SupportScreen} options={{ title: 'Soporte' }} />
      <Stack.Screen name="UpcomingPayments" component={UpcomingPaymentsScreen} options={{ title: 'Próximos Pagos' }} />
      <Stack.Screen name="DetalleTransacción" component={TransactionDetailScreen} options={{ title: 'Detalle de Transacción' }} />
      <Stack.Screen name="EditarEliminarTransacción" component={EditDeleteTransactionScreen} options={{ title: 'Editar/Eliminar Transacción' }} />
      <Stack.Screen name="RecuperarContraseña" component={ForgotPasswordScreen} options={{ title: 'Recuperar Contraseña' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <NavigationContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});