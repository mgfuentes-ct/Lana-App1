import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notifications = [
  { id: '1', message: 'Recordatorio: Tu pago de renta vence mañana.', date: '2025-05-29' },
  { id: '2', message: 'Alerta: Has superado tu presupuesto mensual.', date: '2025-05-28' },
  { id: '3', message: 'Confirmación: Transacción de $500 registrada.', date: '2025-05-27' },
];

export default function NotificationCenterScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centro de Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
});