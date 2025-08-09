import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Picker,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 

const transactions = [
  { id: '1', type: 'ingreso', amount: 1000, category: 'Salario', date: '2025-05-01' },
  { id: '2', type: 'egreso', amount: 500, category: 'Alimentación', date: '2025-05-02' },
  { id: '3', type: 'egreso', amount: 300, category: 'Servicios', date: '2025-05-03' },
  { id: '4', type: 'ingreso', amount: 200, category: 'Reembolso', date: '2025-05-04' },
];

export default function DetailedHistoryScreen() {
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType ? t.type === filterType : true;
    const matchesCategory = filterCategory
      ? t.category.toLowerCase().includes(filterCategory.toLowerCase())
      : true;
    const matchesDate = filterDate ? t.date.includes(filterDate) : true;

    return matchesType && matchesCategory && matchesDate;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial Detallado</Text>

      <Text style={styles.label}>Filtrar por tipo:</Text>
      <Picker selectedValue={filterType} onValueChange={setFilterType}>
        <Picker.Item label="Todos" value="" />
        <Picker.Item label="Ingreso" value="ingreso" />
        <Picker.Item label="Egreso" value="egreso" />
      </Picker>

      <Text style={styles.label}>Filtrar por categoría:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Alimentación"
        value={filterCategory}
        onChangeText={setFilterCategory}
      />

      <Text style={styles.label}>Filtrar por fecha (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2025-05-02"
        value={filterDate}
        onChangeText={setFilterDate}
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.transactionItem,
            item.type === 'egreso' ? { backgroundColor: '#ffe6e6' } : { backgroundColor: '#e6ffe6' }
          ]}>
            <Text>{item.category} - ${item.amount}</Text>
            <Text style={{ fontSize: 12 }}>{item.date}</Text>
          </View>
        )}
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  transactionItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
});