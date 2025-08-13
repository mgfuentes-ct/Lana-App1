// Script de prueba para verificar conexión frontend-backend
const BASE_URL = 'http://192.168.0.105:8000';

async function testConnection() {
  console.log('🔍 Probando conexión al backend...');
  
  try {
    // Probar endpoint de salud
    const healthResponse = await fetch(`${BASE_URL}/`);
    console.log('📊 Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend funcionando:', healthData);
      
      // Probar registro
      const registerData = {
        nombre: 'Test Frontend',
        correo: `test_frontend_${Date.now()}@example.com`,
        contrasena: '123456'
      };
      
      console.log('📤 Enviando datos de registro:', registerData);
      
      const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });
      
      console.log('📊 Registro status:', registerResponse.status);
      
      if (registerResponse.ok) {
        const registerResult = await registerResponse.json();
        console.log('✅ Registro exitoso:', registerResult);
        
        // Probar login automático
        const loginData = {
          correo: registerData.correo,
          contrasena: registerData.contrasena
        };
        
        console.log('🔑 Probando login automático...');
        
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
            user: loginResult.usuario ? loginResult.usuario.nombre : 'Ausente'
          });
        } else {
          const errorData = await loginResponse.text();
          console.log('❌ Error en login:', errorData);
        }
        
      } else {
        const errorData = await registerResponse.text();
        console.log('❌ Error en registro:', errorData);
      }
      
    } else {
      console.log('❌ Backend no responde correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Ejecutar prueba
testConnection();
