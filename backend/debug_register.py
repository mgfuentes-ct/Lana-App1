#!/usr/bin/env python3
"""
Script de depuración para el endpoint de registro
"""

import requests
import json

# Configuración
BASE_URL = "http://192.168.0.105:8000"

def test_register_detailed():
    """Probar registro con información detallada"""
    print("🔍 Probando registro con información detallada...")
    
    # Datos de prueba
    register_data = {
        "nombre": "Usuario Test Debug",
        "correo": "debug@example.com",
        "contrasena": "123456",
        "rol": "usuario"
    }
    
    print(f"📤 Datos enviados: {json.dumps(register_data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        
        print(f"📥 Status Code: {response.status_code}")
        print(f"📥 Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Registro exitoso!")
            print(f"📥 Response: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ Error en registro")
            print(f"📥 Response: {response.text}")
            
            # Intentar parsear como JSON si es posible
            try:
                error_data = response.json()
                print(f"📥 Error JSON: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Error text: {response.text}")
                
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def test_register_minimal():
    """Probar registro con datos mínimos"""
    print("\n🔍 Probando registro con datos mínimos...")
    
    # Solo datos requeridos
    register_data = {
        "nombre": "Test",
        "correo": "test@example.com",
        "contrasena": "123456"
    }
    
    print(f"📤 Datos enviados: {json.dumps(register_data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        
        print(f"📥 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Registro exitoso!")
            print(f"📥 Response: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ Error en registro")
            print(f"📥 Response: {response.text}")
                
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def test_server_status():
    """Probar si el servidor está funcionando"""
    print("🔍 Probando estado del servidor...")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"📥 Status Code: {response.status_code}")
        print(f"📥 Response: {response.text}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando depuración del endpoint de registro...")
    print("=" * 60)
    
    # Probar estado del servidor
    test_server_status()
    
    # Probar registro con datos mínimos
    test_register_minimal()
    
    # Probar registro con datos completos
    test_register_detailed()
    
    print("\n" + "=" * 60)
    print("🏁 Depuración completada!")
