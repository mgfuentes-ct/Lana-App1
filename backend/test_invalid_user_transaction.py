import requests
import json
from datetime import date

BASE_URL = "http://192.168.0.105:8000"

def test_invalid_user_transaction():
    print("🔍 Probando transacción con usuario inválido...")
    
    # 1. Login para obtener token
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
            user_info = login_result.get('usuario', {})
            real_user_id = user_info.get('id')
            
            print(f"✅ Login exitoso - User ID real: {real_user_id}")
            
            headers = {"Authorization": f"Bearer {token}"}
            
            # 2. Obtener categorías
            categorias_response = requests.get(f"{BASE_URL}/transacciones/categorias", headers=headers)
            
            if categorias_response.status_code == 200:
                categorias = categorias_response.json()
                categoria_egreso = None
                for cat in categorias:
                    if cat['tipo'] == 'egreso':
                        categoria_egreso = cat
                        break
                
                if categoria_egreso:
                    print(f"✅ Usando categoría: {categoria_egreso['nombre']} (ID: {categoria_egreso['id']})")
                    
                    # 3. Probar con usuario_id inválido (999999)
                    transaction_data_invalid = {
                        "usuario_id": 999999,  # Usuario que no existe
                        "categoria_id": categoria_egreso['id'],
                        "monto": 100.50,
                        "tipo": "egreso",
                        "descripcion": "Prueba con usuario inválido",
                        "fecha": str(date.today())
                    }
                    
                    print(f"\n📤 Enviando transacción con usuario inválido:")
                    print(f"📋 Data: {json.dumps(transaction_data_invalid, indent=2)}")
                    
                    transaction_response = requests.post(
                        f"{BASE_URL}/transacciones", 
                        json=transaction_data_invalid,
                        headers=headers
                    )
                    
                    print(f"📊 Crear transacción status: {transaction_response.status_code}")
                    
                    if transaction_response.status_code == 200:
                        result = transaction_response.json()
                        print(f"✅ Transacción creada (esto no debería pasar): {result}")
                    else:
                        error_text = transaction_response.text
                        print(f"❌ Error al crear transacción: {error_text}")
                        
                        try:
                            error_json = transaction_response.json()
                            print(f"📋 Detalles del error: {json.dumps(error_json, indent=2)}")
                        except:
                            print(f"📋 Error no es JSON válido: {error_text}")
                    
                    # 4. Probar con usuario_id correcto pero token de otro usuario
                    print(f"\n📤 Enviando transacción con usuario correcto pero token de otro usuario:")
                    
                    transaction_data_correct = {
                        "usuario_id": real_user_id,  # Usuario correcto
                        "categoria_id": categoria_egreso['id'],
                        "monto": 100.50,
                        "tipo": "egreso",
                        "descripcion": "Prueba con usuario correcto",
                        "fecha": str(date.today())
                    }
                    
                    print(f"📋 Data: {json.dumps(transaction_data_correct, indent=2)}")
                    
                    transaction_response2 = requests.post(
                        f"{BASE_URL}/transacciones", 
                        json=transaction_data_correct,
                        headers=headers
                    )
                    
                    print(f"📊 Crear transacción status: {transaction_response2.status_code}")
                    
                    if transaction_response2.status_code == 200:
                        result = transaction_response2.json()
                        print(f"✅ Transacción creada exitosamente: {result}")
                    else:
                        error_text = transaction_response2.text
                        print(f"❌ Error al crear transacción: {error_text}")
                        
                        try:
                            error_json = transaction_response2.json()
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
    test_invalid_user_transaction()
