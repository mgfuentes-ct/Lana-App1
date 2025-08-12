#!/usr/bin/env python3
"""
Script de prueba para verificar los endpoints del dashboard
"""

import requests
import json

# Configuración
BASE_URL = "http://127.0.0.1:8000"

def test_login():
    """Hacer login para obtener un token válido"""
    print("🔐 Obteniendo token de autenticación...")
    
    login_data = {
        "correo": "test2@example.com",
        "contrasena": "123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            print("✅ Login exitoso, token obtenido")
            return token
        else:
            print(f"❌ Error en login: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_dashboard_endpoints(token):
    """Probar todos los endpoints del dashboard"""
    if not token:
        print("❌ No hay token para probar endpoints del dashboard")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n🧪 Probando endpoints del dashboard...")
    print("=" * 50)
    
    # Probar /dashboard/balance
    print("\n1️⃣ Probando /dashboard/balance...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/balance", headers=headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Balance: ${data.get('balance', 0):.2f}")
            print(f"   ✅ Ingresos: ${data.get('ingresos', 0):.2f}")
            print(f"   ✅ Egresos: ${data.get('egresos', 0):.2f}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # Probar /dashboard/transacciones-recientes
    print("\n2️⃣ Probando /dashboard/transacciones-recientes...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/transacciones-recientes?limite=5", headers=headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Transacciones obtenidas: {len(data)}")
            if data:
                for i, t in enumerate(data[:3]):  # Mostrar solo las primeras 3
                    print(f"      {i+1}. {t.get('descripcion', 'Sin descripción')} - ${t.get('monto', 0):.2f}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # Probar /dashboard/resumen
    print("\n3️⃣ Probando /dashboard/resumen...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/resumen?periodo=mes", headers=headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Resumen del mes obtenido:")
            print(f"      📊 Período: {data.get('periodo', 'N/A')}")
            print(f"      💰 Ingresos: ${data.get('ingresos', 0):.2f}")
            print(f"      💸 Gastos: ${data.get('gastos', 0):.2f}")
            print(f"      💎 Ahorros: ${data.get('ahorros', 0):.2f}")
            print(f"      🔢 Total transacciones: {data.get('total_transacciones', 0)}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # Probar /dashboard (endpoint principal)
    print("\n4️⃣ Probando /dashboard (endpoint principal)...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Dashboard principal obtenido:")
            print(f"      💰 Saldo: ${data.get('saldo', 0):.2f}")
            print(f"      📊 Ingresos por categoría: {len(data.get('ingresos_por_categoria', []))}")
            print(f"      📊 Egresos por categoría: {len(data.get('egresos_por_categoria', []))}")
            print(f"      📋 Presupuestos: {len(data.get('presupuestos', []))}")
            print(f"      🔔 Notificaciones no leídas: {data.get('notificaciones_no_leidas', 0)}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas del Dashboard...")
    print("=" * 60)
    
    # Obtener token
    token = test_login()
    
    if token:
        # Probar endpoints del dashboard
        test_dashboard_endpoints(token)
    else:
        print("❌ No se pudo obtener token, no se pueden probar los endpoints")
    
    print("\n" + "=" * 60)
    print("🏁 Pruebas del Dashboard completadas!")

if __name__ == "__main__":
    main()
