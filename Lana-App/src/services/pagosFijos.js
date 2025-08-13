// src/services/pagosFijos.js
import api from '../utils/api';


const BASE = '/pagos-fijos';

export const listarPagosFijos = async () => {
  const { data } = await api.get(BASE);
  return data;
};

export const obtenerPagoFijo = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

export const crearPagoFijo = async (payload) => {
  // payload: { nombre, monto, categoria, frecuencia, fecha_inicio, estado?, activo? }
  const { data } = await api.post(BASE, payload);
  return data;
};

export const actualizarPagoFijo = async (id, payload) => {
  const { data } = await api.put(`${BASE}/${id}`, payload);
  return data;
};

export const eliminarPagoFijo = async (id) => {
  const { data } = await api.delete(`${BASE}/${id}`);
  return data;
};

// Acciones rápidas
export const marcarComoCompletado = async (id) => {
  const { data } = await api.put(`${BASE}/${id}`, { estado: 'Completado' });
  return data;
};

export const toggleActivo = async (id, activo) => {
  const { data } = await api.put(`${BASE}/${id}`, { activo });
  return data;
};
