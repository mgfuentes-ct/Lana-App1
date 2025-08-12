// src/services/dashboardService.js
import api from '../utils/api';

// Obtener resumen del dashboard
export const getDashboardSummary = async () => {
  try {
    const response = await api.get('/dashboard/resumen');
    return {
      success: true,
      data: response.data,
      message: 'Resumen del dashboard obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el resumen del dashboard',
      error
    };
  }
};

// Obtener estadísticas del dashboard
export const getDashboardStats = async (period = 'mes') => {
  try {
    const response = await api.get(`/dashboard/estadisticas?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Estadísticas obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener estadísticas',
      error
    };
  }
};

// Obtener balance actual
export const getCurrentBalance = async () => {
  try {
    const response = await api.get('/dashboard/balance');
    return {
      success: true,
      data: response.data,
      message: 'Balance obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting current balance:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el balance',
      error
    };
  }
};

// Obtener ingresos y gastos por período
export const getIncomeExpenses = async (period = 'mes') => {
  try {
    const response = await api.get(`/dashboard/ingresos-gastos?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Datos de ingresos y gastos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting income expenses:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener ingresos y gastos',
      error
    };
  }
};

// Obtener transacciones recientes
export const getRecentTransactions = async (limit = 5) => {
  try {
    const response = await api.get(`/dashboard/transacciones-recientes?limite=${limit}`);
    return {
      success: true,
      data: response.data,
      message: 'Transacciones recientes obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener transacciones recientes',
      error
    };
  }
};

// Obtener alertas del dashboard
export const getDashboardAlerts = async () => {
  try {
    const response = await api.get('/dashboard/alertas');
    return {
      success: true,
      data: response.data,
      message: 'Alertas obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting dashboard alerts:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener alertas',
      error
    };
  }
};
