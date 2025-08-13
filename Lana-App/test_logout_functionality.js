// test_logout_functionality.js
// Test manual para verificar la funcionalidad de logout

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from './src/services/authService';

// Función para simular el estado de autenticación
const simulateAuthenticatedState = async () => {
  try {
    // Simular un usuario autenticado
    await AsyncStorage.setItem('userToken', 'test-token-123');
    await AsyncStorage.setItem('userInfo', JSON.stringify({
      id: 1,
      nombre: 'Usuario Test',
      correo: 'test@example.com',
      rol: 'usuario'
    }));
    
    console.log('✅ Estado de autenticación simulado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al simular estado de autenticación:', error);
    return false;
  }
};

// Función para verificar que el logout limpia correctamente el estado
const verifyLogoutClearsState = async () => {
  try {
    // Verificar que los datos se han limpiado
    const token = await AsyncStorage.getItem('userToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    
    if (token === null && userInfo === null) {
      console.log('✅ Logout limpia correctamente el estado de autenticación');
      return true;
    } else {
      console.error('❌ Error: Los datos de autenticación no se limpiaron correctamente');
      console.log('Token:', token);
      console.log('UserInfo:', userInfo);
      return false;
    }
  } catch (error) {
    console.error('❌ Error al verificar el estado después del logout:', error);
    return false;
  }
};

// Test principal
const testLogoutFunctionality = async () => {
  console.log('🧪 Iniciando test de funcionalidad de logout...\n');
  
  // Paso 1: Simular estado autenticado
  console.log('📝 Paso 1: Simulando estado autenticado...');
  const authSetup = await simulateAuthenticatedState();
  if (!authSetup) {
    console.log('❌ Test falló en la configuración inicial');
    return;
  }
  
  // Paso 2: Ejecutar logout
  console.log('📝 Paso 2: Ejecutando logout...');
  try {
    const result = await logout();
    if (result.success) {
      console.log('✅ Logout ejecutado correctamente');
    } else {
      console.error('❌ Error en logout:', result.message);
      return;
    }
  } catch (error) {
    console.error('❌ Error al ejecutar logout:', error);
    return;
  }
  
  // Paso 3: Verificar que el estado se limpió
  console.log('📝 Paso 3: Verificando limpieza del estado...');
  const stateCleared = await verifyLogoutClearsState();
  if (!stateCleared) {
    console.log('❌ Test falló en la verificación del estado');
    return;
  }
  
  console.log('\n🎉 ¡Test de logout completado exitosamente!');
  console.log('✅ La funcionalidad de logout está funcionando correctamente');
};

// Ejecutar el test
testLogoutFunctionality().catch(console.error);

export { testLogoutFunctionality };
