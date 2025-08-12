// src/services/transactionService.js
import api from '../utils/api';

// Obtener todas las transacciones del usuario
export const getTransactions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.monto_min) params.append('monto_min', filters.monto_min);
    if (filters.monto_max) params.append('monto_max', filters.monto_max);
    
    const response = await api.get(`/transacciones?${params.toString()}`);
    return {
      success: true,
      data: response.data,
      message: 'Transacciones obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting transactions:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener transacciones',
      error
    };
  }
};

// Obtener una transacción específica
export const getTransaction = async (transactionId) => {
  try {
    const response = await api.get(`/transacciones/${transactionId}`);
    return {
      success: true,
      data: response.data,
      message: 'Transacción obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting transaction:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener la transacción',
      error
    };
  }
};

// Crear una nueva transacción
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transacciones', transactionData);
    return {
      success: true,
      data: response.data,
      message: 'Transacción creada exitosamente'
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear la transacción',
      error
    };
  }
};

// Actualizar una transacción
export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const response = await api.put(`/transacciones/${transactionId}`, transactionData);
    return {
      success: true,
      data: response.data,
      message: 'Transacción actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar la transacción',
      error
    };
  }
};

// Eliminar una transacción
export const deleteTransaction = async (transactionId) => {
  try {
    await api.delete(`/transacciones/${transactionId}`);
    return {
      success: true,
      message: 'Transacción eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar la transacción',
      error
    };
  }
};

// Obtener categorías de transacciones
export const getTransactionCategories = async () => {
  try {
    const response = await api.get('/transacciones/categorias');
    return {
      success: true,
      data: response.data,
      message: 'Categorías obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return {
      success: false,
      message: 'Error al obtener categorías',
      error
    };
  }
};

// Obtener tipos de transacciones
export const getTransactionTypes = async () => {
  try {
    const response = await api.get('/transacciones/tipos');
    return {
      success: true,
      data: response.data,
      message: 'Tipos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting types:', error);
    return {
      success: false,
      message: 'Error al obtener tipos',
      error
    };
  }
};