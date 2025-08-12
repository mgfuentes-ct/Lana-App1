// src/services/authService.js
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (correo, contrasena) => {
  try {
    const response = await api.post('/auth/login', {
      correo,
      contrasena,
    });

    if (response.data && response.data.access_token) {
      const token = response.data.access_token;
      
      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      
      // Guardar información del usuario si está disponible
      if (response.data.usuario) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.usuario));
      }
      
      // Configurar el token en los headers por defecto
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        success: true,
        token,
        usuario: response.data.usuario || null,
        message: 'Login exitoso'
      };
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.response) {
      // Error del servidor
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data?.message || 'Error del servidor';
      
      if (status === 401) {
        return {
          success: false,
          message: 'Correo o contraseña incorrectos'
        };
      } else if (status === 422) {
        return {
          success: false,
          message: 'Datos de entrada inválidos'
        };
      } else if (status >= 500) {
        return {
          success: false,
          message: 'Error del servidor, inténtalo más tarde'
        };
      } else {
        return {
          success: false,
          message
        };
      }
    } else if (error.request) {
      // Error de red
      return {
        success: false,
        message: 'Error de conexión, verifica tu internet'
      };
    } else {
      // Error general
      return {
        success: false,
        message: 'Error inesperado'
      };
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);

    if (response.data && response.data.message) {
      return {
        success: true,
        message: response.data.message || 'Usuario registrado exitosamente'
      };
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.response) {
      // Error del servidor
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data?.message || 'Error del servidor';
      
      if (status === 422) {
        return {
          success: false,
          message: 'Datos de entrada inválidos'
        };
      } else if (status === 409) {
        return {
          success: false,
          message: 'El correo electrónico ya está registrado'
        };
      } else if (status >= 500) {
        return {
          success: false,
          message: 'Error del servidor, inténtalo más tarde'
        };
      } else {
        return {
          success: false,
          message
        };
      }
    } else if (error.request) {
      // Error de red
      return {
        success: false,
        message: 'Error de conexión, verifica tu internet'
      };
    } else {
      // Error general
      return {
        success: false,
        message: 'Error inesperado'
      };
    }
  }
};

export const logout = async () => {
  try {
    // Remover token e información del usuario
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    
    // Limpiar headers de autorización
    delete api.defaults.headers.common['Authorization'];
    
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, message: 'Error al cerrar sesión' };
  }
};

export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return { isAuthenticated: !!token, token };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false, token: null };
  }
};

export const getUserInfo = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};