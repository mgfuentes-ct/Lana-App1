// src/services/authService.js
import api from '../utils/api';

export const login = async (correo, contrasena) => {
  const response = await api.post('/auth/login', {
    correo,
    contrasena,
  });

  // Guarda el token en async storage o en estado
  const token = response.data.access_token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return token;
};