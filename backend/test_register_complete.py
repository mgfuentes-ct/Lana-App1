#!/usr/bin/env python3
"""
Script de prueba completo para verificar registro y login automático
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://192.168.0.105:8000"

def test_register_and_login():
    """Probar registro y luego login automático"""
    print("🚀 Probando registro completo...")
    
    # Generar correo único
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_email = f"test_complete_{timestamp}@example.com"
    
    # Datos de registro
    register_data = {
        "nombre": "Usuario Test Completo",
        "correo": unique_email,
        "contrasena": "123456"
    }
    
    print(f"📤 Registrando usuario: {unique_email}")
    
    try:
        # 1. Registrar usuario
        register_response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        
        print(f"📥 Status Code Registro: {register_response.status_code}")
        
        if register_response.status_code == 200:
            register_result = register_response.json()
            print("✅ Registro exitoso!")
            print(f"📥 Response: {json.dumps(register_result, indent=2)}")
            
            # 2. Probar login inmediatamente después
            print("\n🔑 Probando login después del registro...")
            
            login_data = {
                "correo": unique_email,
                "contrasena": "123456"
            }
            
            login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            
            print(f"📥 Status Code Login: {login_response.status_code}")
            
            if login_response.status_code == 200:
                login_result = login_response.json()
                print("✅ Login exitoso!")
                print(f"📥 Token: {login_result.get('access_token', 'No token')[:20]}...")
                print(f"📥 Usuario: {login_result.get('usuario', {}).get('nombre', 'No user')}")
                
                # 3. Probar endpoint protegido
                print("\n🔒 Probando endpoint protegido...")
                
                headers = {"Authorization": f"Bearer {login_result['access_token']}"}
                protected_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
                
                print(f"📥 Status Code Protegido: {protected_response.status_code}")
                
                if protected_response.status_code == 200:
                    print("✅ Endpoint protegido accesible!")
                    protected_result = protected_response.json()
                    print(f"📥 Usuario autenticado: {protected_result.get('nombre', 'No name')}")
                else:
                    print("❌ Error en endpoint protegido")
                    print(f"📥 Response: {protected_response.text}")
                
            else:
                print("❌ Error en login")
                print(f"📥 Response: {login_response.text}")
                
        else:
            print("❌ Error en registro")
            print(f"📥 Response: {register_response.text}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    print("=" * 60)
    test_register_and_login()
    print("\n" + "=" * 60)
    print("🏁 Prueba completada!")
