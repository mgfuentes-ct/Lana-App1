// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '192.168.0.108:8000', // cambia según tu entorno (localhost, IP LAN, etc.)
  timeout: 5000,
});

export default api;