import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Cuentas Bancarias</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del banco"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Saldo inicial"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />

      <Text style={styles.label}>Tipo de cuenta:</Text>
      <Picker selectedValue={type} onValueChange={setType}>
        <Picker.Item label="Ahorro" value="Ahorro" />
        <Picker.Item label="Cheques" value="Cheques" />
        <Picker.Item label="Crédito" value="Crédito" />
      </Picker>

      <Button title="Agregar Cuenta" onPress={handleAddAccount} />

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.accountCard}>
            <Text style={styles.accountName}>{item.name}</Text>
            <Text>Tipo: {item.type}</Text>
            <Text>Saldo: ${item.balance.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteAccount(item.id)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Volver" onPress={() => navigation.goBack()} color="#999" />
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
  accountCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ffcccc',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  deleteText: {
    color: 'red',
  },
});