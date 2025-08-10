// src/screens/BankAccountManagementScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ Import añadido
import { GlobalStyles, Colors } from '../theme/theme'; // ✅ Estilos globales

const initialAccounts = [
  { id: '1', name: 'BBVA', balance: 15000, type: 'Ahorro' },
  { id: '2', name: 'Banamex', balance: 30000, type: 'Cheques' },
];

export default function BankAccountManagementScreen({ navigation }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Ahorro');

  const handleAddAccount = () => {
    if (!name || !balance) return;
    const newAccount = {
      id: String(accounts.length + 1),
      name,
      balance: parseFloat(balance),
      type,
    };
    setAccounts([...accounts, newAccount]);
    setName('');
    setBalance('');
  };

  const handleDeleteAccount = (id) => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de eliminar esta cuenta?',
      [
        { text: 'Cancelar' },
        { text: 'Eliminar', onPress: () => setAccounts(accounts.filter((a) => a.id !== id)) }
      ]
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Gestión de Cuentas Bancarias</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nombre del banco"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Saldo inicial"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />

      <Text style={GlobalStyles.label}>Tipo de cuenta:</Text>
      <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 8, marginBottom: 15 }}>
        <Picker selectedValue={type} onValueChange={setType}>
          <Picker.Item label="Ahorro" value="Ahorro" />
          <Picker.Item label="Cheques" value="Cheques" />
          <Picker.Item label="Crédito" value="Crédito" />
        </Picker>
      </View>

      <Button title="Agregar Cuenta" onPress={handleAddAccount} />

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyles.card}>
            <Text style={GlobalStyles.subtitle}>{item.name}</Text>
            <Text>Tipo: {item.type}</Text>
            <Text>Saldo: ${item.balance.toFixed(2)}</Text>
            <TouchableOpacity
              style={[GlobalStyles.buttonSecondary, { marginTop: 10, backgroundColor: '#ffcccc' }]}
              onPress={() => handleDeleteAccount(item.id)}
            >
              <Text style={{ color: 'red' }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        title="Volver"
        onPress={() => navigation.navigate('Main')} // ✅ Mejor que goBack()
        color="#999"
      />
    </View>
  );
}