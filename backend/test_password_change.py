#!/usr/bin/env python3
"""
Script de prueba para el endpoint de cambio de contraseña
"""
import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"

def test_password_change():
    """Probar el cambio de contraseña"""
    print("🧪 Probando cambio de contraseña...")
    
    # 1. Login para obtener token
    login_data = {
        "correo": "moisex@gmail.com",
        "contrasena": "1234567890"
    }
    
    try:
        print("🔐 Iniciando sesión...")
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"📡 Login - Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print("✅ Login exitoso, token obtenido")
            
            # 2. Cambiar contraseña
            headers = {"Authorization": f"Bearer {token}"}
            password_data = {
                "contrasena_actual": "1234567890",
                "nueva_contrasena": "nueva123456"
            }
            
            print("🔄 Cambiando contraseña...")
            response = requests.put(f"{BASE_URL}/usuarios/cambiar-contrasena", json=password_data, headers=headers)
            print(f"📡 Cambio contraseña - Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Contraseña cambiada exitosamente: {result}")
                print("📧 Se debería haber enviado un correo de notificación")
                
                # 3. Verificar que funciona con la nueva contraseña
                print("🔍 Verificando nueva contraseña...")
                new_login_data = {
                    "correo": "moisex@gmail.com",
                    "contrasena": "nueva123456"
                }
                
                response = requests.post(f"{BASE_URL}/auth/login", json=new_login_data)
                if response.status_code == 200:
                    print("✅ Nueva contraseña funciona correctamente")
                else:
                    print("❌ Error con nueva contraseña")
                    
                # 4. Revertir el cambio (opcional)
                print("🔄 Revirtiendo cambio de contraseña...")
                revert_data = {
                    "contrasena_actual": "nueva123456",
                    "nueva_contrasena": "1234567890"
                }
                
                response = requests.put(f"{BASE_URL}/usuarios/cambiar-contrasena", json=revert_data, headers=headers)
                if response.status_code == 200:
                    print("✅ Contraseña revertida exitosamente")
                else:
                    print("❌ Error revirtiendo contraseña")
                    
            else:
                print(f"❌ Error en cambio de contraseña: {response.text}")
        else:
            print(f"❌ Error en login: {response.text}")
            
    except Exception as e:
        print(f"❌ Error en prueba: {e}")

if __name__ == "__main__":
    test_password_change()
