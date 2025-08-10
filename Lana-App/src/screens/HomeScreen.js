import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Inicio</Text>

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
        <Text>Gráfico tipo pastel (ejemplo)</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.quickAccess}
          onPress={() => navigation.navigate('NuevaTransacción')}
        >
          <Text>Nueva Transacción</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickAccess}
          onPress={() => navigation.navigate('Charts')}
        >
          <Text>Ver Gráficas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickAccess}
          onPress={() => navigation.navigate('UpcomingPayments')}
        >
          <Text>Próximos Pagos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
    top: 3,
    paddingBottom: 10,
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
    flexWrap: 'wrap',
  },
  quickAccess: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
});