import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

export default function ChartsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gráficas Financieras</Text>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Gastos por Categoría</Text>
        {/* Simulación de un gráfico de pastel */}
        <Text>Alimentación: 40%</Text>
        <Text>Transporte: 20%</Text>
        <Text>Servicios: 15%</Text>
        <Text>Otros: 25%</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Ingresos vs Gastos (Mes Actual)</Text>
        {/* Simulación de gráfico de barras */}
        <Text>Ingresos: $10,000</Text>
        <Text>Gastos: $7,000</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Ver Detalle de Gráfica" onPress={() => alert('Ir a detalle')} />
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
  chartCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});