import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'usuario@gmail.com' && password === '12345') {
      alert('Inicio de sesión exitoso');
      navigation.navigate('Home'); // Redirigir al Panel Principal
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
      />

      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Button title="¿Olvidaste tu contraseña?" onPress={() => navigation.navigate('RecuperarContraseña')} color="blue" />
      <Button title="Volver" onPress={() => navigation.goBack()} color="#999" />
    </View>
  );
};

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

export default LoginScreen;