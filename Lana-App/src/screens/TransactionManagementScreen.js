import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ Añadir
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ Importar SafeAreaView

const transactions = [
  { id: '1', type: 'egreso', amount: 500, category: 'Alimentación', date: '2025-06-01' },
  { id: '2', type: 'ingreso', amount: 10000, category: 'Nómina', date: '2025-05-30' },
  { id: '3', type: 'egreso', amount: 3000, category: 'Renta', date: '2025-05-28' },
];

export default function TransactionManagementScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text>{item.type === 'egreso' ? `-${item.amount}` : `+${item.amount}`} | {item.category}</Text>
      <Text style={{ fontSize: 12 }}>{item.date}</Text>
      <Button title="Ver Detalle" onPress={() => navigation.navigate('DetalleTransacción', { transaction: item })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Transacciones</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Button title="Filtrar" onPress={() => alert('Mostrar filtros')} />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
});