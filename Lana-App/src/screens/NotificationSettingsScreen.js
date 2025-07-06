import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';

export default function NotificationSettingsScreen({ navigation }) {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleSave = () => {
    alert('Preferencias guardadas');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Notificaciones</Text>

      <View style={styles.setting}>
        <Text>Recibir por correo</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>

      <View style={styles.setting}>
        <Text>Recibir por SMS</Text>
        <Switch value={smsEnabled} onValueChange={setSmsEnabled} />
      </View>

      <View style={styles.setting}>
        <Text>Recordatorios de pagos</Text>
        <Switch value={remindersEnabled} onValueChange={setRemindersEnabled} />
      </View>

      <Button title="Guardar Cambios" onPress={handleSave} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});