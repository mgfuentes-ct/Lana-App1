from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import SessionLocal
from backend.models.BD import CuentaBancaria
from backend.schemas.cuenta_bancaria import CuentaCreate, CuentaResponse
from backend.utils.auth import obtener_usuario_actual

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/accounts", response_model=CuentaResponse)
def agregar_cuenta(payload: CuentaCreate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    nueva = CuentaBancaria(usuario_id=usuario.id, **payload.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/accounts", response_model=List[CuentaResponse])
def listar_cuentas(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    return db.query(CuentaBancaria).filter(CuentaBancaria.usuario_id == usuario.id).all()

@router.delete("/accounts/{id}")
def eliminar_cuenta(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    cuenta = db.query(CuentaBancaria).filter(CuentaBancaria.id == id, CuentaBancaria.usuario_id == usuario.id).first()
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    
    db.delete(cuenta)
    db.commit()
    return {"mensaje": "Cuenta eliminada correctamente"}