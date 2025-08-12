import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Text, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { createTransaction, getTransactionCategories, getTransactionTypes } from '../services/transactionService';

export default function TransactionFormScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Estados del formulario
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('egreso');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  
  // Estados para los datos de la API
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setIsLoadingData(true);
      
      // Cargar categorías y tipos en paralelo
      const [categoriesResult, typesResult] = await Promise.all([
        getTransactionCategories(),
        getTransactionTypes()
      ]);

      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
        if (categoriesResult.data.length > 0) {
          setCategory(categoriesResult.data[0].id);
        }
      }

      if (typesResult.success) {
        setTypes(typesResult.data);
        if (typesResult.data.length > 0) {
          setType(typesResult.data[0].id);
        }
      }

    } catch (error) {
      console.error('Error loading form data:', error);
      Alert.alert('Error', 'No se pudieron cargar las opciones del formulario');
    } finally {
      setIsLoadingData(false);
    }
  };

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor que 0');
      return false;
    }
    if (!category) {
      Alert.alert('Error', 'Debes seleccionar una categoría');
      return false;
    }
    if (!date) {
      Alert.alert('Error', 'Debes seleccionar una fecha');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const transactionData = {
        usuario_id: user.id,
        monto: parseFloat(amount),
        tipo: type,
        categoria_id: parseInt(category),
        descripcion: description.trim() || 'Sin descripción',
        fecha: date
      };

      const result = await createTransaction(transactionData);

      if (result.success) {
        Alert.alert(
          '¡Éxito!',
          'Transacción creada correctamente',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert('Error', 'Ocurrió un error al crear la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando opciones...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nueva Transacción</Text>

      <Text style={styles.label}>Tipo:</Text>
      <Picker 
        selectedValue={type} 
        onValueChange={setType}
        style={styles.picker}
      >
        {types.map((typeItem) => (
          <Picker.Item 
            key={typeItem.id} 
            label={typeItem.nombre} 
            value={typeItem.id} 
          />
        ))}
      </Picker>

      <Text style={styles.label}>Monto:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Ej: 500.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Categoría:</Text>
      <Picker 
        selectedValue={category} 
        onValueChange={setCategory}
        style={styles.picker}
      >
        {categories
          .filter(cat => cat.tipo === type)
          .map((cat) => (
            <Picker.Item 
              key={cat.id} 
              label={cat.nombre} 
              value={cat.id} 
            />
          ))}
      </Picker>

      <Text style={styles.label}>Fecha:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholder="Detalles adicionales..."
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar Transacción</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#34495e',
  },
  input: {
    height: 50,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    height: 50,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
  },
});