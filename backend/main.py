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
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import usuarios
from routes import transacciones
from routes import dashboard
from routes import pagos_fijos
from routes import presupuestos
from routes import notificaciones
from routes import soporte
from routes import graficas

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los headers
)

# Rutas
app.include_router(usuarios.router)
app.include_router(transacciones.router)
app.include_router(dashboard.router)
app.include_router(pagos_fijos.router)
app.include_router(presupuestos.router)
app.include_router(notificaciones.router)
app.include_router(soporte.router)
app.include_router(graficas.router)

@app.get("/")
def read_root():
    return {"mensaje": "API funcionando correctamente"}

