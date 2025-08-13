// Script para probar la conexión del frontend al backend
const BASE_URL = 'http://192.168.0.105:8000';

async function testFrontendConnection() {
  console.log('🔍 Probando conexión frontend-backend...');
  
  try {
    // 1. Probar endpoint de salud
    const healthResponse = await fetch(`${BASE_URL}/`);
    console.log('📊 Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend funcionando:', healthData);
      
      // 2. Probar login
      const loginData = {
        correo: 'test@example.com',
        contrasena: '123456'
      };
      
      console.log('🔑 Probando login...');
      
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
        console.log('✅ Login exitoso:', {
          token: loginResult.access_token ? 'Presente' : 'Ausente',
          user: loginResult.usuario ? loginResult.usuario.nombre : 'Ausente',
          userId: loginResult.usuario ? loginResult.usuario.id : 'Ausente'
        });
        
        // 3. Probar endpoint con token
        const token = loginResult.access_token;
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        console.log('📋 Probando endpoint protegido...');
        
        const categoriasResponse = await fetch(`${BASE_URL}/transacciones/categorias`, {
          headers: headers
        });
        
        console.log('📊 Categorías status:', categoriasResponse.status);
        
        if (categoriasResponse.ok) {
          const categorias = await categoriasResponse.json();
          console.log('✅ Categorías obtenidas:', categorias.length, 'categorías');
          
          // 4. Probar creación de transacción
          if (categorias.length > 0) {
            const categoria = categorias.find(cat => cat.tipo === 'egreso');
            
            if (categoria) {
              console.log('📤 Probando creación de transacción...');
              
              const transactionData = {
                usuario_id: loginResult.usuario.id,
                categoria_id: categoria.id,
                monto: 50.00,
                tipo: 'egreso',
                descripcion: 'Prueba desde frontend',
                fecha: new Date().toISOString().split('T')[0]
              };
              
              console.log('📋 Transaction data:', transactionData);
              
              const transactionResponse = await fetch(`${BASE_URL}/transacciones`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(transactionData)
              });
              
              console.log('📊 Transaction status:', transactionResponse.status);
              
              if (transactionResponse.ok) {
                const transactionResult = await transactionResponse.json();
                console.log('✅ Transacción creada:', transactionResult);
              } else {
                const errorText = await transactionResponse.text();
                console.log('❌ Error en transacción:', errorText);
              }
            }
          }
        } else {
          const errorText = await categoriasResponse.text();
          console.log('❌ Error obteniendo categorías:', errorText);
        }
        
      } else {
        const errorText = await loginResponse.text();
        console.log('❌ Error en login:', errorText);
      }
      
    } else {
      console.log('❌ Backend no responde correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Ejecutar prueba
testFrontendConnection();
