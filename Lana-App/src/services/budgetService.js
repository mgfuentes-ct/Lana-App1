// src/services/budgetService.js
import api from '../utils/api';

// Obtener todos los presupuestos del usuario
export const getBudgets = async (period = 'mes') => {
  try {
    const response = await api.get(`/presupuestos?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Presupuestos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting budgets:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener presupuestos',
      error
    };
  }
};

// Obtener un presupuesto específico
export const getBudget = async (budgetId) => {
  try {
    const response = await api.get(`/presupuestos/${budgetId}`);
    return {
      success: true,
      data: response.data,
      message: 'Presupuesto obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting budget:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el presupuesto',
      error
    };
  }
};

// Crear un nuevo presupuesto
export const createBudget = async (budgetData) => {
  try {
    const response = await api.post('/presupuestos', budgetData);
    return {
      success: true,
      data: response.data,
      message: 'Presupuesto creado exitosamente'
    };
  } catch (error) {
    console.error('Error creating budget:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear el presupuesto',
      error
    };
  }
};

// Actualizar un presupuesto
export const updateBudget = async (budgetId, budgetData) => {
  try {
    const response = await api.put(`/presupuestos/${budgetId}`, budgetData);
    return {
      success: true,
      data: response.data,
      message: 'Presupuesto actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating budget:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar el presupuesto',
      error
    };
  }
};

// Eliminar un presupuesto
export const deleteBudget = async (budgetId) => {
  try {
    await api.delete(`/presupuestos/${budgetId}`);
    return {
      success: true,
      message: 'Presupuesto eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error deleting budget:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar el presupuesto',
      error
    };
  }
};

// Obtener categorías de presupuesto
export const getBudgetCategories = async () => {
  try {
    const response = await api.get('/presupuestos/categorias');
    return {
      success: true,
      data: response.data,
      message: 'Categorías de presupuesto obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting budget categories:', error);
    return {
      success: false,
      message: 'Error al obtener categorías de presupuesto',
      error
    };
  }
};

// Obtener resumen de presupuestos
export const getBudgetSummary = async (period = 'mes') => {
  try {
    const response = await api.get(`/presupuestos/resumen?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Resumen de presupuestos obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting budget summary:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener resumen de presupuestos',
      error
    };
  }
};

// Obtener alertas de presupuesto
export const getBudgetAlerts = async () => {
  try {
    const response = await api.get('/presupuestos/alertas');
    return {
      success: true,
      data: response.data,
      message: 'Alertas de presupuesto obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting budget alerts:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener alertas de presupuesto',
      error
    };
  }
};
