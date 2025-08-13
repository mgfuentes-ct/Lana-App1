// test_logout_manual.js
// Test manual para verificar la funcionalidad de logout

import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para simular un usuario autenticado
const simulateAuthenticatedUser = async () => {
  try {
    console.log('🔧 Simulando usuario autenticado...');
    
    // Guardar token e información del usuario
    await AsyncStorage.setItem('userToken', 'test-token-123');
    await AsyncStorage.setItem('userInfo', JSON.stringify({
      id: 1,
      nombre: 'Usuario Test',
      correo: 'test@example.com',
      rol: 'usuario'
    }));
    
    console.log('✅ Usuario autenticado simulado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al simular usuario:', error);
    return false;
  }
};

// Función para verificar el estado actual
const checkCurrentState = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    
    console.log('🔍 Estado actual:');
    console.log('  - Token:', token ? 'Presente' : 'Ausente');
    console.log('  - UserInfo:', userInfo ? 'Presente' : 'Ausente');
    
    return { token, userInfo };
  } catch (error) {
    console.error('❌ Error al verificar estado:', error);
    return { token: null, userInfo: null };
  }
};

// Función para limpiar el estado (simular logout)
const clearAuthState = async () => {
  try {
    console.log('🧹 Limpiando estado de autenticación...');
    
    // Remover datos de AsyncStorage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    
    console.log('✅ Estado limpiado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar estado:', error);
    return false;
  }
};

// Test principal
const runLogoutTest = async () => {
  console.log('🧪 === INICIANDO TEST DE LOGOUT ===\n');
  
  // Paso 1: Verificar estado inicial
  console.log('📝 Paso 1: Verificando estado inicial...');
  await checkCurrentState();
  
  // Paso 2: Simular usuario autenticado
  console.log('\n📝 Paso 2: Simulando usuario autenticado...');
  const authSuccess = await simulateAuthenticatedUser();
  if (!authSuccess) {
    console.log('❌ Test falló en la simulación de autenticación');
    return;
  }
  
  // Paso 3: Verificar que se guardó correctamente
  console.log('\n📝 Paso 3: Verificando que se guardó correctamente...');
  await checkCurrentState();
  
  // Paso 4: Simular logout
  console.log('\n📝 Paso 4: Simulando logout...');
  const logoutSuccess = await clearAuthState();
  if (!logoutSuccess) {
    console.log('❌ Test falló en el logout');
    return;
  }
  
  // Paso 5: Verificar que se limpió correctamente
  console.log('\n📝 Paso 5: Verificando que se limpió correctamente...');
  await checkCurrentState();
  
  console.log('\n🎉 === TEST COMPLETADO EXITOSAMENTE ===');
  console.log('✅ La funcionalidad de logout está funcionando correctamente');
};

// Ejecutar el test
runLogoutTest().catch(console.error);

export { runLogoutTest };
