from fastapi import FastAPI, HTTPException, Depends 
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from datetime import date
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:@localhost/lanaapp"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UsuarioCreate(BaseModel):
    nombre: str
    correo: str
    contrasena: str

    class Config:
        orm_mode = True # Permite que Pydantic lea los datos de los modelos de SQLAlchemy

class TransaccionCreate(BaseModel):
    usuario_id: int
    cuenta_id: int
    categoria_id: int
    monto: float
    tipo: str
    descripcion: str = ""
    fecha: date

    class Config:
        orm_mode = True

