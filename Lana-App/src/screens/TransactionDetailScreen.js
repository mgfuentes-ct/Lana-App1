import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TransactionDetailScreen({ route, navigation }) {
  // Datos simulados de la transacción (pueden venir desde navegación)
  const transaction = route.params?.transaction || {
    id: 1,
    amount: 500,
    category: 'Alimentación',
    date: '2025-05-28',
    description: 'Compra en supermercado',
    type: 'egreso',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de Transacción</Text>

      <View style={styles.detailCard}>
        <Text style={styles.detailLabel}>Monto:</Text>
        <Text style={styles.detailValue}>{`${transaction.type === 'egreso' ? '- ' : '+ '}$${transaction.amount}`}</Text>

        <Text style={styles.detailLabel}>Categoría:</Text>
        <Text style={styles.detailValue}>{transaction.category}</Text>

        <Text style={styles.detailLabel}>Fecha:</Text>
        <Text style={styles.detailValue}>{transaction.date}</Text>

        <Text style={styles.detailLabel}>Descripción:</Text>
        <Text style={styles.detailValue}>{transaction.description}</Text>
      </View>

      <Button title="Editar" onPress={() => navigation.navigate('EditarEliminarTransacción', { transaction })} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailValue: {
    fontSize: 16,
    marginLeft: 10,
  },
});