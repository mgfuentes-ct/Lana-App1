// src/services/chartService.js
import api from '../utils/api';

// Obtener datos generales de gráficas
export const getChartData = async (period = 'mes') => {
  try {
    const response = await api.get(`/graficas/metricas?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Datos de gráficas obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting chart data:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener datos de gráficas',
      error
    };
  }
};

// Obtener ingresos vs gastos
export const getIncomeExpenses = async (period = 'mes') => {
  try {
    const response = await api.get(`/graficas/ingresos-gastos?periodo=${period}&agrupar_por=categoria`);
    return {
      success: true,
      data: response.data,
      message: 'Datos de ingresos vs gastos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting income expenses:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener ingresos vs gastos',
      error
    };
  }
};

// Obtener distribución por categoría
export const getCategoryDistribution = async (period = 'mes', type = 'gastos') => {
  try {
    const response = await api.get(`/graficas/distribucion-categoria?periodo=${period}&tipo=${type}`);
    return {
      success: true,
      data: response.data,
      message: 'Distribución por categoría obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting category distribution:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener distribución por categoría',
      error
    };
  }
};

// Obtener comparación mensual
export const getMonthlyComparison = async (months = 6) => {
  try {
    const response = await api.get(`/graficas/comparacion-mensual?meses=${months}`);
    return {
      success: true,
      data: response.data,
      message: 'Comparación mensual obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting monthly comparison:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener comparación mensual',
      error
    };
  }
};

// Obtener métricas de gráficas
export const getChartMetrics = async (period = 'mes') => {
  try {
    const response = await api.get(`/graficas/metricas?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Métricas obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting chart metrics:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener métricas',
      error
    };
  }
};

// Obtener evolución temporal
export const getTemporalEvolution = async (period = 'mes', metric = 'balance') => {
  try {
    const response = await api.get(`/graficas/evolucion-temporal?periodo=${period}&metrica=${metric}`);
    return {
      success: true,
      data: response.data,
      message: 'Evolución temporal obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting temporal evolution:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener evolución temporal',
      error
    };
  }
};

// Obtener presupuesto vs real
export const getBudgetVsReal = async (period = 'mes') => {
  try {
    const response = await api.get(`/graficas/presupuesto-vs-real?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Datos de presupuesto vs real obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting budget vs real:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener presupuesto vs real',
      error
    };
  }
};

// Obtener tendencias
export const getTrends = async (period = 'año', metric = 'gastos') => {
  try {
    const response = await api.get(`/graficas/tendencias?periodo=${period}&metrica=${metric}`);
    return {
      success: true,
      data: response.data,
      message: 'Tendencias obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting trends:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener tendencias',
      error
    };
  }
};

// Obtener gráfica de pagos fijos
export const getFixedPaymentsChart = async (period = 'mes') => {
  try {
    const response = await api.get(`/graficas/pagos-fijos?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Datos de pagos fijos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting fixed payments chart:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener datos de pagos fijos',
      error
    };
  }
};

// Obtener gráfica de ahorros
export const getSavingsChart = async (period = 'año') => {
  try {
    const response = await api.get(`/graficas/ahorros?periodo=${period}`);
    return {
      success: true,
      data: response.data,
      message: 'Datos de ahorros obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting savings chart:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener datos de ahorros',
      error
    };
  }
};
