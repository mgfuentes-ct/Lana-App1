// Script final para probar la creación de transacciones
const BASE_URL = 'http://192.168.0.105:8000';

async function testFinalTransaction() {
  console.log('🎯 Prueba final de creación de transacciones...');
  
  try {
    // 1. Login
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
      console.log('👤 Usuario:', userInfo.nombre);
      console.log('🆔 User ID:', userInfo.id);
      
      // 2. Obtener categorías
      const categoriasResponse = await fetch(`${BASE_URL}/transacciones/categorias`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (categoriasResponse.ok) {
        const categorias = await categoriasResponse.json();
        console.log('📋 Categorías disponibles:', categorias.length);
        
        // 3. Crear múltiples transacciones para probar
        const testTransactions = [
          {
            descripcion: 'Comida del día',
            monto: 25.50,
            tipo: 'egreso'
          },
          {
            descripcion: 'Salario',
            monto: 1500.00,
            tipo: 'ingreso'
          },
          {
            descripcion: 'Transporte',
            monto: 15.00,
            tipo: 'egreso'
          }
        ];
        
        for (let i = 0; i < testTransactions.length; i++) {
          const testTx = testTransactions[i];
          
          // Buscar categoría apropiada
          const categoria = categorias.find(cat => cat.tipo === testTx.tipo);
          
          if (categoria) {
            console.log(`\n📤 Creando transacción ${i + 1}: ${testTx.descripcion}`);
            
            const transactionData = {
              usuario_id: parseInt(userInfo.id), // Asegurar que sea número
              categoria_id: categoria.id,
              monto: testTx.monto,
              tipo: testTx.tipo,
              descripcion: testTx.descripcion,
              fecha: new Date().toISOString().split('T')[0]
            };
            
            console.log('📋 Transaction data:', JSON.stringify(transactionData, null, 2));
            
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
              console.log(`✅ Transacción ${i + 1} creada exitosamente`);
              console.log(`   ID: ${result.id}, Monto: $${result.monto}, Tipo: ${result.tipo}`);
            } else {
              const errorText = await transactionResponse.text();
              console.log(`❌ Error en transacción ${i + 1}: ${errorText}`);
            }
          } else {
            console.log(`❌ No se encontró categoría para tipo: ${testTx.tipo}`);
          }
        }
        
        // 4. Obtener todas las transacciones para verificar
        console.log('\n📋 Obteniendo todas las transacciones...');
        
        const allTransactionsResponse = await fetch(`${BASE_URL}/transacciones`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (allTransactionsResponse.ok) {
          const allTransactions = await allTransactionsResponse.json();
          console.log(`✅ Total de transacciones: ${allTransactions.length}`);
          
          // Mostrar las últimas 5 transacciones
          const recentTransactions = allTransactions.slice(0, 5);
          console.log('📋 Últimas transacciones:');
          recentTransactions.forEach((tx, index) => {
            console.log(`   ${index + 1}. ${tx.descripcion} - $${tx.monto} (${tx.tipo})`);
          });
        }
        
      } else {
        console.log('❌ Error obteniendo categorías:', await categoriasResponse.text());
      }
      
    } else {
      console.log('❌ Error en login:', await loginResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar prueba final
testFinalTransaction();
