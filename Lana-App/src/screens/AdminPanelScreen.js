import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';

export default function AdminPanelScreen({ navigation }) {
  const { clearAuthState } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Llamar al servicio de logout
              const result = await logout();
              
              if (result.success) {
                // Limpiar el estado de autenticación
                await clearAuthState();
                
                // Mostrar mensaje de éxito y forzar navegación
                Alert.alert(
                  'Sesión Cerrada', 
                  'Has cerrado sesión correctamente',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('✅ Logout completado exitosamente');
                        // Forzar navegación a la pantalla de autenticación
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Auth' }],
                        });
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', result.message || 'Error al cerrar sesión');
              }
            } catch (error) {
              console.error('Error en logout:', error);
              Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Panel Administrativo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Usuarios Activos</Text>
        <Text style={styles.stat}>1,250</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transacciones Totales</Text>
        <Text style={styles.stat}>$1,200,000</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reportes Pendientes</Text>
        <Text style={styles.stat}>5</Text>
      </View>

      <Button title="Ver Lista de Usuarios" onPress={() => alert('Lista de usuarios')} />
      <Button title="Ver Reportes" onPress={() => alert('Generando reportes')} />
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#ff4444" />
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stat: {
    fontSize: 20,
    color: '#333',
  },
});