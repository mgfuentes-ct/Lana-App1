// Script para simular el problema de AsyncStorage en el frontend
const BASE_URL = 'http://192.168.0.105:8000';

async function testAsyncStorageIssue() {
  console.log('🔍 Probando problema de AsyncStorage...');
  
  try {
    // 1. Simular login y guardado en AsyncStorage
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: 'test@example.com',
        contrasena: '123456'
      })
    });
    
    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      const token = loginResult.access_token;
      const userInfo = loginResult.usuario;
      
      console.log('✅ Login exitoso');
      console.log('👤 User info del backend:', userInfo);
      console.log('🆔 User ID del backend:', userInfo?.id);
      
      // 2. Simular guardado en AsyncStorage (como lo hace el frontend)
      console.log('\n💾 Simulando guardado en AsyncStorage...');
      
      // Simular AsyncStorage.setItem('userToken', token)
      console.log('📱 Token guardado:', token ? 'Presente' : 'Ausente');
      
      // Simular AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
      const userInfoString = JSON.stringify(userInfo);
      console.log('👤 User info guardado:', userInfoString);
      
      // 3. Simular recuperación desde AsyncStorage (como lo hace el frontend)
      console.log('\n📱 Simulando recuperación desde AsyncStorage...');
      
      // Simular AsyncStorage.getItem('userToken')
      const retrievedToken = token; // En realidad sería await AsyncStorage.getItem('userToken')
      console.log('🔑 Token recuperado:', retrievedToken ? 'Presente' : 'Ausente');
      
      // Simular AsyncStorage.getItem('userInfo')
      const retrievedUserInfoString = userInfoString; // En realidad sería await AsyncStorage.getItem('userInfo')
      console.log('📄 User info string recuperado:', retrievedUserInfoString);
      
      // Simular JSON.parse(retrievedUserInfoString)
      let retrievedUserInfo = null;
      try {
        retrievedUserInfo = JSON.parse(retrievedUserInfoString);
        console.log('👤 User info parseado:', retrievedUserInfo);
        console.log('🆔 User ID recuperado:', retrievedUserInfo?.id);
        console.log('📱 Tipo del User ID:', typeof retrievedUserInfo?.id);
      } catch (parseError) {
        console.log('❌ Error parseando user info:', parseError.message);
      }
      
      // 4. Simular diferentes escenarios de user.id problemático
      console.log('\n🔍 Probando diferentes escenarios de user.id...');
      
      // Escenario A: user.id es undefined (problema común)
      console.log('\n📱 Escenario A: user.id es undefined');
      const userUndefined = { ...retrievedUserInfo, id: undefined };
      await testTransactionWithUser(userUndefined, token);
      
      // Escenario B: user.id es null
      console.log('\n📱 Escenario B: user.id es null');
      const userNull = { ...retrievedUserInfo, id: null };
      await testTransactionWithUser(userNull, token);
      
      // Escenario C: user.id es string
      console.log('\n📱 Escenario C: user.id es string');
      const userString = { ...retrievedUserInfo, id: String(retrievedUserInfo?.id) };
      await testTransactionWithUser(userString, token);
      
      // Escenario D: user.id es correcto
      console.log('\n📱 Escenario D: user.id es correcto');
      await testTransactionWithUser(retrievedUserInfo, token);
      
    } else {
      console.log('❌ Error en login:', await loginResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

async function testTransactionWithUser(user, token) {
  try {
    console.log(`📋 Probando con user.id = ${user?.id} (tipo: ${typeof user?.id})`);
    
    // Obtener categorías
    const categoriasResponse = await fetch(`${BASE_URL}/transacciones/categorias`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (categoriasResponse.ok) {
      const categorias = await categoriasResponse.json();
      const categoriaEgreso = categorias.find(cat => cat.tipo === 'egreso');
      
      if (categoriaEgreso) {
        // Crear transacción
        const transactionData = {
          usuario_id: user?.id,
          categoria_id: categoriaEgreso.id,
          monto: 100.00,
          tipo: 'egreso',
          descripcion: `Prueba con user.id = ${user?.id}`,
          fecha: new Date().toISOString().split('T')[0]
        };
        
        const transactionResponse = await fetch(`${BASE_URL}/transacciones`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transactionData)
        });
        
        console.log(`📊 Status: ${transactionResponse.status}`);
        
        if (transactionResponse.ok) {
          console.log(`✅ Éxito con user.id = ${user?.id}`);
        } else {
          const errorText = await transactionResponse.text();
          console.log(`❌ Error con user.id = ${user?.id}: ${errorText}`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error con user.id = ${user?.id}: ${error.message}`);
  }
}

// Ejecutar prueba
testAsyncStorageIssue();
