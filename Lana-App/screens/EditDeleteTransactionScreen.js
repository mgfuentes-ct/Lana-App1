import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function EditDeleteTransactionScreen({ route, navigation }) {
  const transaction = route.params?.transaction || {
    id: '1',
    type: 'egreso',
    amount: 500,
    category: 'Alimentación',
    date: '2025-05-02',
  };

  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date);

  const handleSave = () => {
    Alert.alert('Guardado', `Transacción actualizada:\n${category} - $${amount}`);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar esta transacción?', [
      { text: 'Cancelar' },
      { text: 'Eliminar', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Transacción</Text>

      <Text style={styles.label}>Monto:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Categoría:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Fecha:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />

      <Button title="Guardar Cambios" onPress={handleSave} />
      <Button title="Eliminar Transacción" onPress={handleDelete} color="red" />
      <Button title="Cancelar" onPress={() => navigation.goBack()} color="#999" />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});