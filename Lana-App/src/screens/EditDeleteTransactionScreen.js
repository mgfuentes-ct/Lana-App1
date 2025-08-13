import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { updateTransaction, deleteTransaction } from '../services/transactionService';

export default function EditDeleteTransactionScreen({ route, navigation }) {
  const transaction = route.params?.transaction || {
    id: '1',
    tipo: 'egreso',
    monto: 500,
    descripcion: 'Transacción de ejemplo',
    fecha: '2025-05-02',
  };

  console.log('📝 Datos de transacción recibidos:', transaction);

  const [amount, setAmount] = useState(transaction.monto?.toString() || '0');
  const [description, setDescription] = useState(transaction.descripcion || '');
  const [date, setDate] = useState(transaction.fecha || '');
  const [type, setType] = useState(transaction.tipo || 'egreso');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Validar campos
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor que 0');
      return;
    }
    
    // Validar límite del monto (máximo 999,999,999.99)
    const montoValue = parseFloat(amount);
    if (montoValue > 999999999.99) {
      Alert.alert('Error', 'El monto no puede ser mayor a $999,999,999.99');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }
    
    if (!date) {
      Alert.alert('Error', 'La fecha es obligatoria');
      return;
    }

    try {
      setIsLoading(true);
      
      // Validar formato de fecha
      const fechaObj = new Date(date);
      if (isNaN(fechaObj.getTime())) {
        Alert.alert('Error', 'Formato de fecha inválido. Use YYYY-MM-DD');
        return;
      }

      // Solo enviar campos que han cambiado
      const transactionData = {};
      
      if (montoValue !== transaction.monto) {
        transactionData.monto = montoValue;
      }
      
      if (description.trim() !== (transaction.descripcion || '')) {
        transactionData.descripcion = description.trim();
      }
      
      if (type !== transaction.tipo) {
        transactionData.tipo = type;
      }
      
      if (date !== transaction.fecha) {
        transactionData.fecha = date;
      }
      
      // Si no hay cambios, mostrar mensaje
      if (Object.keys(transactionData).length === 0) {
        Alert.alert('Info', 'No hay cambios para guardar');
        return;
      }
      
      console.log('📝 Enviando datos actualizados:', transactionData);

      console.log('📝 Datos originales de la transacción:', transaction);
      console.log('📝 Datos a enviar para actualización:', transactionData);
      
      const result = await updateTransaction(transaction.id, transactionData);
      
      if (result.success) {
        Alert.alert(
          'Éxito', 
          'Transacción actualizada correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('✅ Transacción actualizada exitosamente');
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Error al actualizar la transacción');
      }
    } catch (error) {
      console.error('❌ Error al actualizar transacción:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Transacción', 
      '¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              console.log('🗑️ Eliminando transacción:', transaction.id);
              
              const result = await deleteTransaction(transaction.id);
              
              if (result.success) {
                Alert.alert(
                  'Éxito', 
                  'Transacción eliminada correctamente',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('✅ Transacción eliminada exitosamente');
                        navigation.goBack();
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', result.message || 'Error al eliminar la transacción');
              }
            } catch (error) {
              console.error('❌ Error al eliminar transacción:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar la transacción');
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Transacción</Text>
      
      <Text style={styles.subtitle}>
        ID: {transaction.id} | Categoría: {transaction.categoria?.nombre || 'Sin categoría'}
      </Text>

      <Text style={styles.label}>Monto:</Text>
      <Text style={styles.hint}>Máximo: $999,999,999.99</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.typeContainer}>
        <Button 
          title="Ingreso" 
          onPress={() => setType('ingreso')} 
          color={type === 'ingreso' ? '#4CAF50' : '#ccc'}
        />
        <Button 
          title="Egreso" 
          onPress={() => setType('egreso')} 
          color={type === 'egreso' ? '#f44336' : '#ccc'}
        />
      </View>

      <Text style={styles.label}>Fecha:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      ) : (
        <>
          <Button title="Guardar Cambios" onPress={handleSave} />
          <Button title="Eliminar Transacción" onPress={handleDelete} color="red" />
          <Button title="Cancelar" onPress={() => navigation.goBack()} color="#999" />
        </>
      )}
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});