// src/services/userService.js
import api from '../utils/api';

// Obtener perfil del usuario actual
export const getUserProfile = async () => {
  try {
    const response = await api.get('/usuarios/perfil');
    return {
      success: true,
      data: response.data,
      message: 'Perfil obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el perfil',
      error
    };
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/usuarios/perfil', profileData);
    return {
      success: true,
      data: response.data,
      message: 'Perfil actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar el perfil',
      error
    };
  }
};

// Cambiar contraseña
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/usuarios/cambiar-contrasena', passwordData);
    return {
      success: true,
      message: 'Contraseña cambiada exitosamente'
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al cambiar la contraseña',
      error
    };
  }
};

// Obtener configuración del usuario
export const getUserSettings = async () => {
  try {
    const response = await api.get('/usuarios/configuracion');
    return {
      success: true,
      data: response.data,
      message: 'Configuración obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener la configuración',
      error
    };
  }
};

// Actualizar configuración del usuario
export const updateUserSettings = async (settingsData) => {
  try {
    const response = await api.put('/usuarios/configuracion', settingsData);
    return {
      success: true,
      data: response.data,
      message: 'Configuración actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error updating user settings:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar la configuración',
      error
    };
  }
};

// Eliminar cuenta del usuario
export const deleteUserAccount = async () => {
  try {
    await api.delete('/usuarios/cuenta');
    return {
      success: true,
      message: 'Cuenta eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error deleting user account:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar la cuenta',
      error
    };
  }
};

// Obtener historial de actividad
export const getUserActivityHistory = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/usuarios/actividad?pagina=${page}&limite=${limit}`);
    return {
      success: true,
      data: response.data,
      message: 'Historial de actividad obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting user activity history:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el historial de actividad',
      error
    };
  }
};
