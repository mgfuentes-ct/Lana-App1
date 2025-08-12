// src/services/fixedPaymentService.js
import api from '../utils/api';

// Obtener todos los pagos fijos del usuario
export const getFixedPayments = async () => {
  try {
    const response = await api.get('/pagos-fijos');
    return {
      success: true,
      data: response.data,
      message: 'Pagos fijos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting fixed payments:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener pagos fijos',
      error
    };
  }
};

// Obtener un pago fijo específico
export const getFixedPayment = async (paymentId) => {
  try {
    const response = await api.get(`/pagos-fijos/${paymentId}`);
    return {
      success: true,
      data: response.data,
      message: 'Pago fijo obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting fixed payment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el pago fijo',
      error
    };
  }
};

// Crear un nuevo pago fijo
export const createFixedPayment = async (paymentData) => {
  try {
    const response = await api.post('/pagos-fijos', paymentData);
    return {
      success: true,
      data: response.data,
      message: 'Pago fijo creado exitosamente'
    };
  } catch (error) {
    console.error('Error creating fixed payment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear el pago fijo',
      error
    };
  }
};

// Actualizar un pago fijo
export const updateFixedPayment = async (paymentId, paymentData) => {
  try {
    const response = await api.put(`/pagos-fijos/${paymentId}`, paymentData);
    return {
      success: true,
      data: response.data,
      message: 'Pago fijo actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating fixed payment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar el pago fijo',
      error
    };
  }
};

// Eliminar un pago fijo
export const deleteFixedPayment = async (paymentId) => {
  try {
    await api.delete(`/pagos-fijos/${paymentId}`);
    return {
      success: true,
      message: 'Pago fijo eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error deleting fixed payment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar el pago fijo',
      error
    };
  }
};

// Obtener próximos pagos fijos
export const getUpcomingFixedPayments = async (days = 30) => {
  try {
    const response = await api.get(`/pagos-fijos/proximos?dias=${days}`);
    return {
      success: true,
      data: response.data,
      message: 'Próximos pagos fijos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting upcoming fixed payments:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener próximos pagos fijos',
      error
    };
  }
};

// Obtener categorías de pagos fijos
export const getFixedPaymentCategories = async () => {
  try {
    const response = await api.get('/pagos-fijos/categorias');
    return {
      success: true,
      data: response.data,
      message: 'Categorías de pagos fijos obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting fixed payment categories:', error);
    return {
      success: false,
      message: 'Error al obtener categorías de pagos fijos',
      error
    };
  }
};

// Obtener frecuencias de pagos fijos
export const getFixedPaymentFrequencies = async () => {
  try {
    const response = await api.get('/pagos-fijos/frecuencias');
    return {
      success: true,
      data: response.data,
      message: 'Frecuencias de pagos fijos obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting fixed payment frequencies:', error);
    return {
      success: false,
      message: 'Error al obtener frecuencias de pagos fijos',
      error
    };
  }
};

// Pausar un pago fijo
export const pauseFixedPayment = async (paymentId) => {
  try {
    const response = await api.put(`/pagos-fijos/${paymentId}/pausar`);
    return {
      success: true,
      message: 'Pago fijo pausado exitosamente'
    };
  } catch (error) {
    console.error('Error pausing fixed payment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al pausar el pago fijo',
      error
    };
  }
};

// Reanudar un pago fijo
export const resumeFixedPayment = async (paymentId) => {
  try {
    const response = await api.put(`/pagos-fijos/${paymentId}/reanudar`);
    return {
      success: true,
      message: 'Pago fijo reanudado exitosamente'
    };
  } catch (error) {
    console.error('Error resuming fixed payment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al reanudar el pago fijo',
      error
    };
  }
};
