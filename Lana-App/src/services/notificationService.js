// src/services/notificationService.js
import api from '../utils/api';

// Obtener todas las notificaciones del usuario
export const getNotifications = async (page = 1, limit = 20, unreadOnly = false) => {
  try {
    const params = new URLSearchParams({
      pagina: page,
      limite: limit,
      solo_no_leidas: unreadOnly
    });
    
    const response = await api.get(`/notificaciones?${params.toString()}`);
    return {
      success: true,
      data: response.data,
      message: 'Notificaciones obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener notificaciones',
      error
    };
  }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notificaciones/${notificationId}/leer`);
    return {
      success: true,
      message: 'Notificación marcada como leída'
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al marcar notificación como leída',
      error
    };
  }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/notificaciones/marcar-todas-leidas');
    return {
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al marcar todas las notificaciones',
      error
    };
  }
};

// Eliminar una notificación
export const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`/notificaciones/${notificationId}`);
    return {
      success: true,
      message: 'Notificación eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar la notificación',
      error
    };
  }
};

// Eliminar todas las notificaciones leídas
export const deleteAllReadNotifications = async () => {
  try {
    await api.delete('/notificaciones/eliminar-leidas');
    return {
      success: true,
      message: 'Todas las notificaciones leídas eliminadas'
    };
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar notificaciones leídas',
      error
    };
  }
};

// Obtener configuración de notificaciones
export const getNotificationSettings = async () => {
  try {
    const response = await api.get('/notificaciones/configuracion');
    return {
      success: true,
      data: response.data,
      message: 'Configuración de notificaciones obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener configuración de notificaciones',
      error
    };
  }
};

// Actualizar configuración de notificaciones
export const updateNotificationSettings = async (settingsData) => {
  try {
    const response = await api.put('/notificaciones/configuracion', settingsData);
    return {
      success: true,
      data: response.data,
      message: 'Configuración de notificaciones actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar configuración de notificaciones',
      error
    };
  }
};

// Obtener contador de notificaciones no leídas
export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get('/notificaciones/contador-no-leidas');
    return {
      success: true,
      data: response.data,
      message: 'Contador obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener contador de notificaciones',
      error
    };
  }
};
