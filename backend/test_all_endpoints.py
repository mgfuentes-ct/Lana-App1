#!/usr/bin/env python3
"""
Script de prueba completo para verificar todos los endpoints de la API
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://192.168.0.105:8000"

class APITester:
    def __init__(self):
        self.token = None
        self.user_id = None
        
    def test_register(self):
        """Probar registro de usuario"""
        print("🔐 Probando registro de usuario...")
        
        register_data = {
            "nombre": "Usuario Test",
            "correo": "test4@example.com",
            "contrasena": "123456",
            "rol": "usuario"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
            print(f"   Status Code: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Registro exitoso")
                return True
            else:
                print(f"   ❌ Error en registro: {response.text}")
                return False
        except Exception as e:
            print(f"   ❌ Error de conexión: {e}")
            return False
    
    def test_login(self):
        """Probar login para obtener token"""
        print("\n🔑 Probando login...")
        
        login_data = {
            "correo": "test4@example.com",
            "contrasena": "123456"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            print(f"   Status Code: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.user_id = data.get("usuario", {}).get("id")
                print("   ✅ Login exitoso, token obtenido")
                return True
            else:
                print(f"   ❌ Error en login: {response.text}")
                return False
        except Exception as e:
            print(f"   ❌ Error de conexión: {e}")
            return False
    
    def test_dashboard_endpoints(self):
        """Probar endpoints del dashboard"""
        if not self.token:
            print("❌ No hay token para probar dashboard")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n🏠 Probando endpoints del Dashboard...")
        print("=" * 50)
        
        endpoints = [
            ("/dashboard/balance", "GET"),
            ("/dashboard/transacciones-recientes?limite=5", "GET"),
            ("/dashboard/resumen?periodo=mes", "GET"),
            ("/dashboard", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n📊 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_transaction_endpoints(self):
        """Probar endpoints de transacciones"""
        if not self.token:
            print("❌ No hay token para probar transacciones")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n💰 Probando endpoints de Transacciones...")
        print("=" * 50)
        
        endpoints = [
            ("/transacciones", "GET"),
            ("/transacciones/categorias", "GET"),
            ("/transacciones/tipos", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n💳 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_notification_endpoints(self):
        """Probar endpoints de notificaciones"""
        if not self.token:
            print("❌ No hay token para probar notificaciones")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n🔔 Probando endpoints de Notificaciones...")
        print("=" * 50)
        
        endpoints = [
            ("/notificaciones", "GET"),
            ("/notificaciones/configuracion", "GET"),
            ("/notificaciones/contador-no-leidas", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n📢 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_budget_endpoints(self):
        """Probar endpoints de presupuestos"""
        if not self.token:
            print("❌ No hay token para probar presupuestos")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n📋 Probando endpoints de Presupuestos...")
        print("=" * 50)
        
        endpoints = [
            ("/presupuestos", "GET"),
            ("/presupuestos/categorias", "GET"),
            ("/presupuestos/resumen", "GET"),
            ("/presupuestos/alertas", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n📊 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_fixed_payment_endpoints(self):
        """Probar endpoints de pagos fijos"""
        if not self.token:
            print("❌ No hay token para probar pagos fijos")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n📅 Probando endpoints de Pagos Fijos...")
        print("=" * 50)
        
        endpoints = [
            ("/pagos-fijos", "GET"),
            ("/pagos-fijos/proximos", "GET"),
            ("/pagos-fijos/categorias", "GET"),
            ("/pagos-fijos/frecuencias", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n💸 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_chart_endpoints(self):
        """Probar endpoints de gráficas"""
        if not self.token:
            print("❌ No hay token para probar gráficas")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n📈 Probando endpoints de Gráficas...")
        print("=" * 50)
        
        endpoints = [
            ("/graficas/ingresos-gastos?periodo=mes", "GET"),
            ("/graficas/evolucion-temporal?periodo=mes", "GET"),
            ("/graficas/distribucion-categoria?periodo=mes&tipo=gastos", "GET"),
            ("/graficas/comparacion-mensual?meses=6", "GET"),
            ("/graficas/metricas?periodo=mes", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n📊 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_support_endpoints(self):
        """Probar endpoints de soporte"""
        if not self.token:
            print("❌ No hay token para probar soporte")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n🆘 Probando endpoints de Soporte...")
        print("=" * 50)
        
        endpoints = [
            ("/soporte/faq", "GET"),
            ("/soporte/categorias", "GET"),
            ("/soporte/prioridades", "GET"),
            ("/soporte/tickets", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n💬 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def test_user_endpoints(self):
        """Probar endpoints de usuario"""
        if not self.token:
            print("❌ No hay token para probar usuario")
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        print("\n👤 Probando endpoints de Usuario...")
        print("=" * 50)
        
        endpoints = [
            ("/usuarios/perfil", "GET"),
            ("/usuarios/estadisticas", "GET"),
            ("/users/me", "GET")
        ]
        
        for endpoint, method in endpoints:
            print(f"\n👨‍💼 Probando {method} {endpoint}...")
            try:
                if method == "GET":
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{BASE_URL}{endpoint}", headers=headers)
                
                print(f"   Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("   ✅ Endpoint funcionando")
                else:
                    print(f"   ❌ Error: {response.text}")
            except Exception as e:
                print(f"   ❌ Error de conexión: {e}")
    
    def run_all_tests(self):
        """Ejecutar todas las pruebas"""
        print("🚀 Iniciando pruebas completas de la API...")
        print("=" * 80)
        
        # Probar registro y login
        if not self.test_register():
            print("❌ Falló el registro, no se pueden continuar las pruebas")
            return
        
        if not self.test_login():
            print("❌ Falló el login, no se pueden continuar las pruebas")
            return
        
        # Probar todos los módulos
        self.test_dashboard_endpoints()
        self.test_transaction_endpoints()
        self.test_notification_endpoints()
        self.test_budget_endpoints()
        self.test_fixed_payment_endpoints()
        self.test_chart_endpoints()
        self.test_support_endpoints()
        self.test_user_endpoints()
        
        print("\n" + "=" * 80)
        print("🏁 Todas las pruebas completadas!")
        print(f"✅ Usuario de prueba creado: test4@example.com")
        print(f"✅ Token obtenido: {self.token[:20]}...")

def main():
    """Función principal"""
    tester = APITester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
