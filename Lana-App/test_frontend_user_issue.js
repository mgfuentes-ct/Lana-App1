// Script para probar si el problema está en el user.id del frontend
const BASE_URL = 'http://192.168.0.105:8000';

async function testFrontendUserIssue() {
  console.log('🔍 Probando problema del user.id en frontend...');
  
  try {
    // 1. Simular diferentes escenarios de user.id
    
    // Escenario 1: user.id es undefined
    console.log('\n📱 Escenario 1: user.id es undefined');
    await testTransactionWithUserId(undefined);
    
    // Escenario 2: user.id es null
    console.log('\n📱 Escenario 2: user.id es null');
    await testTransactionWithUserId(null);
    
    // Escenario 3: user.id es string vacío
    console.log('\n📱 Escenario 3: user.id es string vacío');
    await testTransactionWithUserId('');
    
    // Escenario 4: user.id es 0
    console.log('\n📱 Escenario 4: user.id es 0');
    await testTransactionWithUserId(0);
    
    // Escenario 5: user.id es un número inválido
    console.log('\n📱 Escenario 5: user.id es número inválido');
    await testTransactionWithUserId(999999);
    
    // Escenario 6: user.id es string
    console.log('\n📱 Escenario 6: user.id es string');
    await testTransactionWithUserId('32');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

async function testTransactionWithUserId(userId) {
  try {
    // Login para obtener token
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
          // Crear transacción con el user.id problemático
          const transactionData = {
            usuario_id: userId,
            categoria_id: categoriaEgreso.id,
            monto: 100.00,
            tipo: 'egreso',
            descripcion: `Prueba con user.id = ${userId}`,
            fecha: new Date().toISOString().split('T')[0]
          };
          
          console.log(`📋 Enviando con usuario_id: ${userId} (tipo: ${typeof userId})`);
          
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
            const result = await transactionResponse.json();
            console.log(`✅ Éxito con user.id = ${userId}`);
          } else {
            const errorText = await transactionResponse.text();
            console.log(`❌ Error con user.id = ${userId}: ${errorText}`);
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error con user.id = ${userId}: ${error.message}`);
  }
}

// Ejecutar prueba
testFrontendUserIssue();
