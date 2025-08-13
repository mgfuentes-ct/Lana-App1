#!/usr/bin/env python3
"""
Script de prueba simple para verificar el servidor
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://192.168.0.105:8000"

def test_server():
    """Probar si el servidor está funcionando"""
    print("🔍 Probando servidor...")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Servidor funcionando - Status: {response.status_code}")
        print(f"📥 Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_register_simple():
    """Probar registro con datos simples"""
    print("\n🔍 Probando registro...")
    
    # Generar correo único con timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_email = f"test_{timestamp}@example.com"
    
    data = {
        "nombre": "Test User",
        "correo": unique_email,
        "contrasena": "123456"
    }
    
    print(f"📤 Enviando datos: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        
        print(f"📥 Status Code: {response.status_code}")
        print(f"📥 Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Registro exitoso!")
            print(f"📥 Response: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ Error en registro")
            print(f"📥 Response: {response.text}")
            
            # Intentar parsear error
            try:
                error_json = response.json()
                print(f"📥 Error JSON: {json.dumps(error_json, indent=2)}")
            except:
                print(f"📥 Error text: {response.text}")
                
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando prueba simple...")
    print("=" * 50)
    
    if test_server():
        test_register_simple()
    
    print("\n" + "=" * 50)
    print("🏁 Prueba completada!")
