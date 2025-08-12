// src/services/supportService.js
import api from '../utils/api';

// Obtener preguntas frecuentes
export const getSupportFAQ = async (category = null) => {
  try {
    const params = category ? `?categoria=${category}` : '';
    const response = await api.get(`/soporte/faq${params}`);
    return {
      success: true,
      data: response.data,
      message: 'FAQ obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting FAQ:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener FAQ',
      error
    };
  }
};

// Obtener categorías de soporte
export const getSupportCategories = async () => {
  try {
    const response = await api.get('/soporte/categorias');
    return {
      success: true,
      data: response.data,
      message: 'Categorías obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting support categories:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener categorías',
      error
    };
  }
};

// Obtener prioridades de soporte
export const getSupportPriorities = async () => {
  try {
    const response = await api.get('/soporte/prioridades');
    return {
      success: true,
      data: response.data,
      message: 'Prioridades obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting support priorities:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener prioridades',
      error
    };
  }
};

// Crear ticket de soporte
export const createSupportTicket = async (ticketData) => {
  try {
    const response = await api.post('/soporte/tickets', ticketData);
    return {
      success: true,
      data: response.data,
      message: 'Ticket creado exitosamente'
    };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear ticket',
      error
    };
  }
};

// Obtener tickets del usuario
export const getUserTickets = async (page = 1, limit = 20, status = null) => {
  try {
    const params = new URLSearchParams();
    params.append('pagina', page);
    params.append('limite', limit);
    if (status) params.append('estado', status);
    
    const response = await api.get(`/soporte/tickets?${params.toString()}`);
    return {
      success: true,
      data: response.data,
      message: 'Tickets obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting user tickets:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener tickets',
      error
    };
  }
};

// Obtener un ticket específico
export const getTicket = async (ticketId) => {
  try {
    const response = await api.get(`/soporte/tickets/${ticketId}`);
    return {
      success: true,
      data: response.data,
      message: 'Ticket obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting ticket:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener ticket',
      error
    };
  }
};

// Actualizar un ticket
export const updateTicket = async (ticketId, updateData) => {
  try {
    const response = await api.put(`/soporte/tickets/${ticketId}`, updateData);
    return {
      success: true,
      data: response.data,
      message: 'Ticket actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar ticket',
      error
    };
  }
};

// Marcar ticket como leído
export const markTicketAsRead = async (ticketId) => {
  try {
    const response = await api.put(`/soporte/tickets/${ticketId}/leer`);
    return {
      success: true,
      data: response.data,
      message: 'Ticket marcado como leído'
    };
  } catch (error) {
    console.error('Error marking ticket as read:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al marcar ticket',
      error
    };
  }
};

// Cerrar un ticket
export const closeTicket = async (ticketId) => {
  try {
    const response = await api.put(`/soporte/tickets/${ticketId}/cerrar`);
    return {
      success: true,
      data: response.data,
      message: 'Ticket cerrado exitosamente'
    };
  } catch (error) {
    console.error('Error closing ticket:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al cerrar ticket',
      error
    };
  }
};

// Eliminar un ticket
export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/soporte/tickets/${ticketId}`);
    return {
      success: true,
      data: response.data,
      message: 'Ticket eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar ticket',
      error
    };
  }
};

// Marcar todos los tickets como leídos
export const markAllTicketsAsRead = async () => {
  try {
    const response = await api.put('/soporte/tickets/marcar-todas-leidas');
    return {
      success: true,
      data: response.data,
      message: 'Todos los tickets marcados como leídos'
    };
  } catch (error) {
    console.error('Error marking all tickets as read:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al marcar tickets',
      error
    };
  }
};

// Eliminar tickets leídos
export const deleteReadTickets = async () => {
  try {
    const response = await api.delete('/soporte/tickets/eliminar-leidas');
    return {
      success: true,
      data: response.data,
      message: 'Tickets leídos eliminados exitosamente'
    };
  } catch (error) {
    console.error('Error deleting read tickets:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar tickets',
      error
    };
  }
};

// Agregar comentario a un ticket
export const addTicketComment = async (ticketId, comment) => {
  try {
    const response = await api.post(`/soporte/tickets/${ticketId}/comentarios`, comment);
    return {
      success: true,
      data: response.data,
      message: 'Comentario agregado exitosamente'
    };
  } catch (error) {
    console.error('Error adding ticket comment:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al agregar comentario',
      error
    };
  }
};

// Obtener comentarios de un ticket
export const getTicketComments = async (ticketId) => {
  try {
    const response = await api.get(`/soporte/tickets/${ticketId}/comentarios`);
    return {
      success: true,
      data: response.data,
      message: 'Comentarios obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting ticket comments:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener comentarios',
      error
    };
  }
};

// Calificar un ticket
export const rateTicket = async (ticketId, rating) => {
  try {
    const response = await api.post(`/soporte/tickets/${ticketId}/calificar`, rating);
    return {
      success: true,
      data: response.data,
      message: 'Ticket calificado exitosamente'
    };
  } catch (error) {
    console.error('Error rating ticket:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al calificar ticket',
      error
    };
  }
};
