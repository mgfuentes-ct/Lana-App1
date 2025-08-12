// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAuthStatus, getUserInfo } from '../services/authService';

// Contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar el estado de autenticación al cargar la app
  useEffect(() => {
    checkAuthOnStart();
  }, []);

  const checkAuthOnStart = async () => {
    try {
      setIsLoading(true);
      const authStatus = await checkAuthStatus();
      
      if (authStatus.isAuthenticated) {
        const userInfo = await getUserInfo();
        setToken(authStatus.token);
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        // Limpiar estado si no hay autenticación
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // En caso de error, asumir que no está autenticado
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el estado de autenticación después del login
  const updateAuthState = async (newToken, userInfo) => {
    try {
      setToken(newToken);
      setUser(userInfo);
      setIsAuthenticated(true);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('userToken', newToken);
      if (userInfo) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
    }
  };

  // Función para limpiar el estado de autenticación (logout)
  const clearAuthState = async () => {
    try {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  // Función para actualizar información del usuario
  const updateUserInfo = async (newUserInfo) => {
    try {
      setUser(newUserInfo);
      if (newUserInfo) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    updateAuthState,
    clearAuthState,
    updateUserInfo,
    checkAuthOnStart,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
