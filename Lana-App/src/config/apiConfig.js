// src/config/apiConfig.js

// Configuración de la API
export const API_CONFIG = {
  // URL base de la API - cambia según tu entorno
  BASE_URL: 'http://127.0.0.1:8000',
  
  // Timeout para las peticiones
  TIMEOUT: 10000,
  
  // Endpoints de autenticación
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Función para obtener la URL base según el entorno
export const getApiBaseUrl = () => {
  // En desarrollo, puedes cambiar esto según tu configuración
  if (__DEV__) {
    // Para desarrollo local
    return 'http://127.0.0.1:8000';
    // Para desarrollo con dispositivo físico (cambia por tu IP local)
    // return 'http://192.168.1.100:8000';
  }
  
  // En producción, usa tu URL de producción
  return 'https://tu-api-produccion.com';
};

// Función para obtener la configuración completa
export const getApiConfig = () => ({
  baseURL: getApiBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});
