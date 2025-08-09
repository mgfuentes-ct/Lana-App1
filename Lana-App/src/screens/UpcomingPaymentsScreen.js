import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const payments = [
  { id: '1', name: 'Renta Mensual', amount: 3000, dueDate: '2025-06-01', status: 'Pendiente' },
  { id: '2', name: 'Suscripción Netflix', amount: 150, dueDate: '2025-06-05', status: 'Pendiente' },
  { id: '3', name: 'Pago de Luz', amount: 400, dueDate: '2025-06-10', status: 'Completado' },
];

export default function UpcomingPaymentsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.paymentCard}>
      <Text style={styles.paymentName}>{item.name}</Text>
      <Text>Monto: ${item.amount}</Text>
      <Text>Fecha: {item.dueDate}</Text>
      <Text style={[styles.status, item.status === 'Completado' ? { color: 'green' } : null]}>
        Estado: {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Próximos Pagos</Text>
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Button title="Volver" onPress={() => navigation.goBack()} color="#999" />
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontWeight: 'bold',
  },
});