import requests
import json
from datetime import date

BASE_URL = "http://192.168.0.105:8000"

def test_transaction_creation():
    print("🔍 Probando creación de transacciones...")
    
    # 1. Primero hacer login para obtener token
    login_data = {
        "correo": "test@example.com",
        "contrasena": "123456"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"📊 Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            token = login_result.get('access_token')
            user_id = login_result.get('usuario', {}).get('id')
            
            print(f"✅ Login exitoso - User ID: {user_id}")
            
            # 2. Obtener categorías disponibles
            headers = {"Authorization": f"Bearer {token}"}
            categorias_response = requests.get(f"{BASE_URL}/transacciones/categorias", headers=headers)
            print(f"📊 Categorías status: {categorias_response.status_code}")
            
            if categorias_response.status_code == 200:
                categorias = categorias_response.json()
                print(f"📋 Categorías disponibles: {len(categorias)}")
                
                # Buscar una categoría de egreso
                categoria_egreso = None
                for cat in categorias:
                    if cat['tipo'] == 'egreso':
                        categoria_egreso = cat
                        break
                
                if categoria_egreso:
                    print(f"✅ Usando categoría: {categoria_egreso['nombre']} (ID: {categoria_egreso['id']})")
                    
                    # 3. Crear transacción
                    transaction_data = {
                        "usuario_id": user_id,
                        "categoria_id": categoria_egreso['id'],
                        "monto": 100.50,
                        "tipo": "egreso",
                        "descripcion": "Prueba de transacción",
                        "fecha": str(date.today())
                    }
                    
                    print(f"📤 Enviando transacción: {json.dumps(transaction_data, indent=2)}")
                    
                    transaction_response = requests.post(
                        f"{BASE_URL}/transacciones", 
                        json=transaction_data,
                        headers=headers
                    )
                    
                    print(f"📊 Crear transacción status: {transaction_response.status_code}")
                    
                    if transaction_response.status_code == 200:
                        result = transaction_response.json()
                        print(f"✅ Transacción creada exitosamente: {result}")
                    else:
                        error_text = transaction_response.text
                        print(f"❌ Error al crear transacción: {error_text}")
                        
                        # Intentar parsear como JSON para más detalles
                        try:
                            error_json = transaction_response.json()
                            print(f"📋 Detalles del error: {json.dumps(error_json, indent=2)}")
                        except:
                            print(f"📋 Error no es JSON válido: {error_text}")
                else:
                    print("❌ No se encontró categoría de egreso")
            else:
                print(f"❌ Error obteniendo categorías: {categorias_response.text}")
        else:
            print(f"❌ Error en login: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {str(e)}")

if __name__ == "__main__":
    test_transaction_creation()
