import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleRecover = () => {
    if (email.includes('@')) {
      Alert.alert('Correo Enviado', 'Hemos enviado instrucciones a tu correo.');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        keyboardType="email-address"
      />
      <Button title="Enviar Instrucciones" onPress={handleRecover} />
      <Button title="Volver" onPress={() => navigation.goBack()} color="#999" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});