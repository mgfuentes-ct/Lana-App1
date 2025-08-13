// src/services/userService.js
import api from '../utils/api';

// Obtener perfil del usuario actual
export const getUserProfile = async () => {
  try {
    console.log('🔄 Obteniendo perfil del usuario...');
    const response = await api.get('/usuarios/perfil');
    console.log('✅ Perfil obtenido exitosamente:', response.data);
    return {
      success: true,
      data: response.data,
      message: 'Perfil obtenido exitosamente'
    };
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    // Manejar errores específicos
    let errorMessage = 'Error al obtener el perfil';
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Usuario no encontrado.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Error del servidor. Inténtalo más tarde.';
    }
    
    return {
      success: false,
      message: errorMessage,
      error
    };
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (profileData) => {
  try {
    console.log('🔄 Enviando actualización de perfil:', JSON.stringify(profileData, null, 2));
    const response = await api.put('/usuarios/perfil', profileData);
    console.log('✅ Perfil actualizado exitosamente:', response.data);
    return {
      success: true,
      data: response.data,
      message: 'Perfil actualizado exitosamente'
    };
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    // Manejar errores específicos
    let errorMessage = 'Error al actualizar el perfil';
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 400) {
      errorMessage = 'Datos inválidos. Verifica la información ingresada.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Usuario no encontrado.';
    } else if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos para modificar este perfil.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Error del servidor. Inténtalo más tarde.';
    }
    
    return {
      success: false,
      message: errorMessage,
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
