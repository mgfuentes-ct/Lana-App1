#!/usr/bin/env python3
"""
Script para probar la conexión a la base de datos
"""

from sqlalchemy import create_engine, text
from database import DATABASE_URL, SessionLocal
from models.BD import Base

def test_database_connection():
    """Probar conexión a la base de datos"""
    print("🔍 Probando conexión a la base de datos...")
    
    try:
        # Crear engine
        engine = create_engine(DATABASE_URL)
        
        # Probar conexión
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Conexión a la base de datos exitosa!")
            
            # Verificar si las tablas existen
            result = connection.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            print(f"📋 Tablas encontradas: {tables}")
            
            # Verificar tabla usuarios específicamente
            if 'usuarios' in tables:
                print("✅ Tabla 'usuarios' existe")
                
                # Contar usuarios
                result = connection.execute(text("SELECT COUNT(*) FROM usuarios"))
                count = result.fetchone()[0]
                print(f"👥 Número de usuarios en la base de datos: {count}")
            else:
                print("❌ Tabla 'usuarios' no existe")
                
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False
    
    return True

def test_session():
    """Probar sesión de SQLAlchemy"""
    print("\n🔍 Probando sesión de SQLAlchemy...")
    
    try:
        db = SessionLocal()
        
        # Probar consulta simple
        result = db.execute(text("SELECT 1"))
        print("✅ Sesión de SQLAlchemy funcionando!")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Error con sesión de SQLAlchemy: {e}")
        return False

def test_models():
    """Probar importación de modelos"""
    print("\n🔍 Probando importación de modelos...")
    
    try:
        from models.BD import Usuario
        print("✅ Modelo Usuario importado correctamente")
        
        # Verificar estructura del modelo
        print(f"📋 Tabla: {Usuario.__tablename__}")
        print(f"📋 Columnas: {[col.name for col in Usuario.__table__.columns]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importando modelos: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Iniciando pruebas de base de datos...")
    print("=" * 60)
    
    # Probar conexión
    db_ok = test_database_connection()
    
    # Probar sesión
    session_ok = test_session()
    
    # Probar modelos
    models_ok = test_models()
    
    print("\n" + "=" * 60)
    print("🏁 Resumen de pruebas:")
    print(f"📊 Conexión DB: {'✅' if db_ok else '❌'}")
    print(f"📊 Sesión SQLAlchemy: {'✅' if session_ok else '❌'}")
    print(f"📊 Modelos: {'✅' if models_ok else '❌'}")
    
    if all([db_ok, session_ok, models_ok]):
        print("\n🎉 Todas las pruebas de base de datos pasaron!")
    else:
        print("\n⚠️ Hay problemas con la base de datos")
