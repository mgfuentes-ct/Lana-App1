// src/config/apiConfig.js
import { Platform } from 'react-native';

// ⚙️ Cambia esta IP a la de tu PC cuando pruebes en dispositivo real
const LAN_FALLBACK = 'http://192.168.100.78:8000'; // ← AJUSTA si es necesario

// Dev/Prod via variables de entorno (Expo recomienda EXPO_PUBLIC_API_URL)
const ENV_URL =
  (typeof process !== 'undefined' &&
    process.env &&
    (process.env.EXPO_PUBLIC_API_URL || process.env.API_URL)) ||
  null;

// Resuelve la baseURL según entorno
export const getApiBaseUrl = () => {
  if (ENV_URL) return ENV_URL;

  // Emuladores y web
  const emulatorURL = Platform.select({
    android: 'http://192.168.100.78:8000',     // Android Emulator
    ios: 'http://localhost:8000',        // iOS Simulator
    default: LAN_FALLBACK,               // Web/otros o dispositivo físico en LAN
  });

  // En modo producción, si no quieres variables de entorno, puedes cambiar aquí:
  if (!__DEV__) {
    // return 'https://tu-api-produccion.com';
    return emulatorURL || LAN_FALLBACK;
  }

  // Desarrollo
  return emulatorURL || LAN_FALLBACK;
};

// Config por defecto
export const API_CONFIG = {
  TIMEOUT: 10000,
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// Retorna objeto de config listo para axios.create()
export const getApiConfig = () => ({
  baseURL: getApiBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});
