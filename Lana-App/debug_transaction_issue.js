// Script para debuggear el problema de creación de transacciones
const BASE_URL = 'http://192.168.0.105:8000';

async function debugTransactionIssue() {
  console.log('🔍 Debuggeando problema de transacciones...');
  
  try {
    // 1. Simular login como lo hace el frontend
    const loginData = {
      correo: 'test@example.com',
      contrasena: '123456'
    };
    
    console.log('🔑 Simulando login del frontend...');
    
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('📊 Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log('✅ Login exitoso');
      console.log('👤 User info del backend:', loginResult.usuario);
      console.log('🆔 User ID del backend:', loginResult.usuario?.id);
      console.log('🔑 Token presente:', loginResult.access_token ? 'Sí' : 'No');
      
      const token = loginResult.access_token;
      const userInfo = loginResult.usuario;
      
      // 2. Simular lo que haría el frontend - guardar en AsyncStorage
      console.log('\n💾 Simulando guardado en AsyncStorage...');
      console.log('📱 Token a guardar:', token ? 'Presente' : 'Ausente');
      console.log('👤 User info a guardar:', userInfo ? JSON.stringify(userInfo) : 'Ausente');
      
      // 3. Simular recuperación como lo haría el frontend
      console.log('\n📱 Simulando recuperación desde AsyncStorage...');
      console.log('👤 User info recuperada:', userInfo);
      console.log('🆔 User ID recuperado:', userInfo?.id);
      
      // 4. Simular creación de transacción como lo hace el frontend
      if (userInfo && userInfo.id) {
        console.log('\n📤 Simulando creación de transacción...');
        
        // Obtener categorías primero
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
            console.log('✅ Categoría encontrada:', categoriaEgreso.nombre);
            
            // Crear transacción con los datos exactos del frontend
            const transactionData = {
              usuario_id: userInfo.id, // Este es el problema potencial
              categoria_id: categoriaEgreso.id,
              monto: 100.00,
              tipo: 'egreso',
              descripcion: 'Prueba desde frontend',
              fecha: new Date().toISOString().split('T')[0]
            };
            
            console.log('📋 Transaction data (como frontend):', JSON.stringify(transactionData, null, 2));
            
            const transactionResponse = await fetch(`${BASE_URL}/transacciones`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(transactionData)
            });
            
            console.log('📊 Transaction response status:', transactionResponse.status);
            
            if (transactionResponse.ok) {
              const result = await transactionResponse.json();
              console.log('✅ Transacción creada exitosamente:', result);
            } else {
              const errorText = await transactionResponse.text();
              console.log('❌ Error en transacción:', errorText);
              
              try {
                const errorJson = JSON.parse(errorText);
                console.log('📋 Error details:', JSON.stringify(errorJson, null, 2));
              } catch (e) {
                console.log('📋 Error no es JSON válido');
              }
            }
          } else {
            console.log('❌ No se encontró categoría de egreso');
          }
        } else {
          console.log('❌ Error obteniendo categorías:', await categoriasResponse.text());
        }
      } else {
        console.log('❌ No se pudo obtener user ID del login');
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Error en login:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar debug
debugTransactionIssue();
