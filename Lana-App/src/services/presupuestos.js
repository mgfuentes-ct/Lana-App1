// src/services/presupuestos.js
import api from '../utils/api';

const BASE = '/presupuestos';

export const listarPresupuestos = async () => {
  const { data } = await api.get(BASE);
  return data;
};

export const obtenerPresupuesto = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

export const crearPresupuesto = async (payload) => {
  // payload: { categoria_id, nombre, monto_total, fecha_inicio, fecha_fin }
  const { data } = await api.post(BASE, payload);
  return data;
};

export const actualizarPresupuesto = async (id, payload) => {
  const { data } = await api.put(`${BASE}/${id}`, payload);
  return data;
};

export const eliminarPresupuesto = async (id) => {
  const { data } = await api.delete(`${BASE}/${id}`);
  return data;
};
