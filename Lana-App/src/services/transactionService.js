// src/services/transactionService.js
import api from '../utils/api';

export const crearTransaccion = async (transaccion) => {
  const response = await api.post('/transactions', transaccion);
  return response.data;
};