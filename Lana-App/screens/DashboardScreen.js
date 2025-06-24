import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Panel Principal</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Actual</Text>
        <Text style={styles.balance}>$ 15,000.00 MXN</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Últimas Transacciones</Text>
        <Text>- Compra Amazon: - $500</Text>
        <Text>- Depósito Nómina: + $10,000</Text>
        <Text>- Renta Mensual: - $3,000</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gráfico de Gastos</Text>
        {/* Aquí iría un gráfico real usando react-native-svg o librerías */}
        <Text>Gráfico tipo pastel (ejemplo)</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Ir a Transacciones" onPress={() => alert('Transacciones')} />
        <Button title="Ver Gráficas" onPress={() => alert('Gráficas')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balance: {
    fontSize: 20,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});