# from fastapi import FastAPI, HTTPException, Depends 
# from pydantic import BaseModel
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, Session
# from datetime import date
# from sqlalchemy.ext.declarative import declarative_base

# SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:@localhost/lanaapp"

# engine = create_engine(SQLALCHEMY_DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# app = FastAPI()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# class UsuarioCreate(BaseModel):
#     nombre: str
#     correo: str
#     contrasena: str

#     class Config:
#         orm_mode = True # Permite que Pydantic lea los datos de los modelos de SQLAlchemy

# class TransaccionCreate(BaseModel):
#     usuario_id: int
#     cuenta_id: int
#     categoria_id: int
#     monto: float
#     tipo: str
#     descripcion: str = ""
#     fecha: date

#     class Config:
#         orm_mode = True

from fastapi import FastAPI
from backend.routes import rutas  # Asegúrate de tener esto bien importado
from backend.routes import rutas, transacciones
from backend.routes import dashboard
from backend.routes import pagos_fijos
from backend.routes import cuentas_bancarias
from backend.routes import notificaciones
from backend.routes import soporte
from backend.routes import graficas

app = FastAPI()

# Rutas
app.include_router(rutas.router)
app.include_router(transacciones.router)
app.include_router(dashboard.router)
app.include_router(pagos_fijos.router)
app.include_router(cuentas_bancarias.router)
app.include_router(notificaciones.router)
app.include_router(soporte.router)
app.include_router(graficas.router)

@app.get("/")
def read_root():
    return {"mensaje": "API funcionando correctamente"}

