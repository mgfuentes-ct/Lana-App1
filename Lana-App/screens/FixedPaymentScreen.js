import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';

export default function FixedPaymentScreen({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Renta');
  const [frequency, setFrequency] = useState('Mensual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    alert(`Pago fijo guardado:\n${name} - $${amount} (${frequency})`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Pago:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Renta"
      />

      <Text style={styles.label}>Monto:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Ej: 3000"
      />

      <Text style={styles.label}>Categoría:</Text>
      <Picker selectedValue={category} onValueChange={setCategory}>
        <Picker.Item label="Renta" value="Renta" />
        <Picker.Item label="Servicios" value="Servicios" />
        <Picker.Item label="Suscripción" value="Suscripción" />
      </Picker>

      <Text style={styles.label}>Frecuencia:</Text>
      <Picker selectedValue={frequency} onValueChange={setFrequency}>
        <Picker.Item label="Mensual" value="Mensual" />
        <Picker.Item label="Quincenal" value="Quincenal" />
        <Picker.Item label="Semanal" value="Semanal" />
      </Picker>

      <Text style={styles.label}>Fecha de Inicio:</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
      />

      <Button title="Guardar Pago Fijo" onPress={handleSave} />
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
});