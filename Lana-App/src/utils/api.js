// src/utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiConfig } from '../config/apiConfig';

// 🔐 Claves usadas en AsyncStorage
const TOKEN_KEY = 'userToken';
const USER_INFO_KEY = 'userInfo';

const api = axios.create(getApiConfig());

// ---------- DEBUG de red: log de todas las requests ----------
api.interceptors.request.use((config) => {
  // Log básico de salida
  console.log(
    `[API:REQ] ${String(config.method).toUpperCase()} ${config.baseURL || ''}${config.url}`,
    { headers: config.headers, data: config.data }
  );
  return config;
});

// ========== Interceptor REQUEST: agrega Authorization Bearer ==========
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token agregado a la petición:', config.url);
      } else {
        console.log('⚠️ No se encontró token para la petición:', config.url);
      }
    } catch (err) {
      console.warn('No se pudo leer el token:', err?.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== Interceptor RESPONSE: log + manejo 401 ==========
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API:RES] ${response.status} ${String(response.config.method).toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const method = error?.config?.method ? String(error.config.method).toUpperCase() : 'UNK';
    const url = error?.config?.url || 'UNK';
    console.log(`[API:ERR] ${status ?? 'NO-STATUS'} ${method} ${url}`, {
      data: error?.response?.data,
    });

    if (status === 401) {
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_INFO_KEY);
      } catch {}
      console.log('401 no autorizado: token inválido/expirado');
      // Aquí podrías emitir un evento de logout o navegar al login
    }
    return Promise.reject(error);
  }
);

// ========== Helpers opcionales ==========
export async function setAuthToken(token) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_INFO_KEY);
}

export function setBaseURL(newURL) {
  if (newURL && typeof newURL === 'string') {
    api.defaults.baseURL = newURL;
  }
}

export function getBaseURL() {
  return api.defaults.baseURL;
}

export default api;
