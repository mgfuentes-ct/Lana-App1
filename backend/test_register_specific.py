#!/usr/bin/env python3
"""
Script de prueba específico para el endpoint de registro
"""

import requests
import json

# Configuración
BASE_URL = "http://192.168.0.105:8000"

def test_register_with_different_data():
    """Probar registro con diferentes tipos de datos"""
    
    test_cases = [
        {
            "name": "Datos válidos completos",
            "data": {
                "nombre": "Usuario Test",
                "correo": "test1@example.com",
                "contrasena": "123456",
                "rol": "usuario"
            }
        },
        {
            "name": "Datos mínimos (sin rol)",
            "data": {
                "nombre": "Usuario Test 2",
                "correo": "test2@example.com",
                "contrasena": "123456"
            }
        },
        {
            "name": "Datos con rol admin",
            "data": {
                "nombre": "Admin Test",
                "correo": "admin@example.com",
                "contrasena": "123456",
                "rol": "admin"
            }
        },
        {
            "name": "Datos con contraseña corta",
            "data": {
                "nombre": "Usuario Test 3",
                "correo": "test3@example.com",
                "contrasena": "123",
                "rol": "usuario"
            }
        },
        {
            "name": "Datos con email inválido",
            "data": {
                "nombre": "Usuario Test 4",
                "correo": "invalid-email",
                "contrasena": "123456",
                "rol": "usuario"
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n🧪 Test {i}: {test_case['name']}")
        print(f"📤 Datos: {json.dumps(test_case['data'], indent=2)}")
        
        try:
            response = requests.post(f"{BASE_URL}/auth/register", json=test_case['data'])
            
            print(f"📥 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Éxito!")
                print(f"📥 Response: {json.dumps(response.json(), indent=2)}")
            else:
                print("❌ Error")
                print(f"📥 Response: {response.text}")
                
                # Intentar parsear como JSON
                try:
                    error_data = response.json()
                    print(f"📥 Error JSON: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"📥 Error text: {response.text}")
                    
        except Exception as e:
            print(f"❌ Error de conexión: {e}")

def test_server_health():
    """Probar salud del servidor"""
    print("🔍 Probando salud del servidor...")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"📥 Status Code: {response.status_code}")
        print(f"📥 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Servidor funcionando correctamente")
        else:
            print("❌ Problema con el servidor")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando pruebas específicas del endpoint de registro...")
    print("=" * 70)
    
    # Probar salud del servidor
    test_server_health()
    
    # Probar diferentes casos de datos
    test_register_with_different_data()
    
    print("\n" + "=" * 70)
    print("🏁 Pruebas completadas!")
