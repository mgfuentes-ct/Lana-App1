#!/usr/bin/env python3
"""
Script de prueba para verificar los endpoints de autenticación
"""

import requests 
import json 

# Configuración
BASE_URL = "http://127.0.0.1:8000"

def test_register():
    """Prueba el endpoint de registro"""
    print("🧪 Probando registro de usuario...")
    
    user_data = {
        "nombre": "Usuario Test 2",
        "correo": "test2@example.com",
        "contrasena": "123456",
        "rol": "usuario"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Registro exitoso!")
            return True
        else:
            print("❌ Error en registro")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_login():
    """Prueba el endpoint de login"""
    print("\n🧪 Probando login...")
    
    login_data = {
        "correo": "test2@example.com",
        "contrasena": "123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Login exitoso!")
            token = response.json().get("access_token")
            if token:
                print(f"Token obtenido: {token[:20]}...")
            return token
        else:
            print("❌ Error en login")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_protected_endpoint(token):
    """Prueba un endpoint protegido"""
    if not token:
        print("❌ No hay token para probar endpoint protegido")
        return
        
    print("\n🧪 Probando endpoint protegido...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Endpoint protegido accesible!")
        else:
            print("❌ Error accediendo a endpoint protegido")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas de la API de autenticación...")
    print("=" * 50)
    
    # Probar registro
    register_success = test_register()
    
    if register_success:
        # Probar login
        token = test_login()
        
        if token:
            # Probar endpoint protegido
            test_protected_endpoint(token)
    
    print("\n" + "=" * 50)
    print("🏁 Pruebas completadas!")

if __name__ == "__main__":
    main()
