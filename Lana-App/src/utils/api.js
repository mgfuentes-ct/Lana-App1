// src/utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiConfig } from '../config/apiConfig';

const api = axios.create(getApiConfig());

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      // Aquí podrías redirigir al login o mostrar un modal
      console.log('Token expirado o inválido');
    }
    return Promise.reject(error);
  }
);

export default api;