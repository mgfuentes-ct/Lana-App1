import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function TransactionFormScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentación');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    alert(`Transacción guardada:\nMonto: ${amount}\nCategoría: ${category}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Monto:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Ej: 500"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Categoría:</Text>
      <Picker selectedValue={category} onValueChange={setCategory}>
        <Picker.Item label="Alimentación" value="Alimentación" />
        <Picker.Item label="Transporte" value="Transporte" />
        <Picker.Item label="Servicios" value="Servicios" />
        <Picker.Item label="Ingreso" value="Ingreso" />
      </Picker>

      <Text style={styles.label}>Fecha:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholder="Detalles adicionales..."
      />

      <Button title="Guardar Transacción" onPress={handleSave} />
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
});