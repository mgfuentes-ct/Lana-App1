// src/services/bankAccountService.js
import api from '../utils/api';

// Obtener todas las cuentas bancarias del usuario
export const getBankAccounts = async () => {
  try {
    const response = await api.get('/cuentas-bancarias');
    return {
      success: true,
      data: response.data,
      message: 'Cuentas bancarias obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting bank accounts:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener cuentas bancarias',
      error
    };
  }
};

// Obtener una cuenta bancaria específica
export const getBankAccount = async (accountId) => {
  try {
    const response = await api.get(`/cuentas-bancarias/${accountId}`);
    return {
      success: true,
      data: response.data,
      message: 'Cuenta bancaria obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error getting bank account:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener la cuenta bancaria',
      error
    };
  }
};

// Crear una nueva cuenta bancaria
export const createBankAccount = async (accountData) => {
  try {
    const response = await api.post('/cuentas-bancarias', accountData);
    return {
      success: true,
      data: response.data,
      message: 'Cuenta bancaria creada exitosamente'
    };
  } catch (error) {
    console.error('Error creating bank account:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear la cuenta bancaria',
      error
    };
  }
};

// Actualizar una cuenta bancaria
export const updateBankAccount = async (accountId, accountData) => {
  try {
    const response = await api.put(`/cuentas-bancarias/${accountId}`, accountData);
    return {
      success: true,
      data: response.data,
      message: 'Cuenta bancaria actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error updating bank account:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar la cuenta bancaria',
      error
    };
  }
};

// Eliminar una cuenta bancaria
export const deleteBankAccount = async (accountId) => {
  try {
    await api.delete(`/cuentas-bancarias/${accountId}`);
    return {
      success: true,
      message: 'Cuenta bancaria eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al eliminar la cuenta bancaria',
      error
    };
  }
};

// Obtener balance de una cuenta bancaria
export const getBankAccountBalance = async (accountId) => {
  try {
    const response = await api.get(`/cuentas-bancarias/${accountId}/balance`);
    return {
      success: true,
      data: response.data,
      message: 'Balance obtenido exitosamente'
    };
  } catch (error) {
    console.error('Error getting bank account balance:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener el balance',
      error
    };
  }
};

// Obtener transacciones de una cuenta bancaria
export const getBankAccountTransactions = async (accountId, page = 1, limit = 20) => {
  try {
    const params = new URLSearchParams({
      pagina: page,
      limite: limit
    });
    
    const response = await api.get(`/cuentas-bancarias/${accountId}/transacciones?${params.toString()}`);
    return {
      success: true,
      data: response.data,
      message: 'Transacciones de la cuenta obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting bank account transactions:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener transacciones de la cuenta',
      error
    };
  }
};

// Obtener bancos disponibles
export const getAvailableBanks = async () => {
  try {
    const response = await api.get('/cuentas-bancarias/bancos');
    return {
      success: true,
      data: response.data,
      message: 'Bancos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting available banks:', error);
    return {
      success: false,
      message: 'Error al obtener bancos disponibles',
      error
    };
  }
};

// Obtener tipos de cuenta
export const getAccountTypes = async () => {
  try {
    const response = await api.get('/cuentas-bancarias/tipos');
    return {
      success: true,
      data: response.data,
      message: 'Tipos de cuenta obtenidos exitosamente'
    };
  } catch (error) {
    console.error('Error getting account types:', error);
    return {
      success: false,
      message: 'Error al obtener tipos de cuenta',
      error
    };
  }
};

// Obtener monedas disponibles
export const getAvailableCurrencies = async () => {
  try {
    const response = await api.get('/cuentas-bancarias/monedas');
    return {
      success: true,
      data: response.data,
      message: 'Monedas obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error getting available currencies:', error);
    return {
      success: false,
      message: 'Error al obtener monedas disponibles',
      error
    };
  }
};

// Transferir entre cuentas
export const transferBetweenAccounts = async (transferData) => {
  try {
    const response = await api.post('/cuentas-bancarias/transferir', transferData);
    return {
      success: true,
      data: response.data,
      message: 'Transferencia realizada exitosamente'
    };
  } catch (error) {
    console.error('Error transferring between accounts:', error);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al realizar la transferencia',
      error
    };
  }
};
