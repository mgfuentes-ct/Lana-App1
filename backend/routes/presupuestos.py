from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.BD import Presupuesto
from schemas.presupuestos import PresupuestoCreate, PresupuestoOut, PresupuestoUpdate
from database import SessionLocal
from utils.auth import obtener_usuario_actual

router = APIRouter()

def get_db():
    with SessionLocal() as db:
        yield db

@router.post("/", response_model=PresupuestoOut)
def create_presupuesto(presupuesto: PresupuestoCreate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    nuevo_presupuesto = Presupuesto(**presupuesto.dict(), usuario_id=usuario.id)
    db.add(nuevo_presupuesto)
    db.commit()
    db.refresh(nuevo_presupuesto)
    return nuevo_presupuesto

@router.get("/{presupuesto_id}", response_model=PresupuestoOut)
def get_presupuesto(presupuesto_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    presupuesto = db.query(Presupuesto).filter(
        Presupuesto.id == presupuesto_id,
        Presupuesto.usuario_id == usuario.id
    ).first()
    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return presupuesto

@router.put("/{presupuesto_id}", response_model=PresupuestoOut)
def update_presupuesto(presupuesto_id: int, payload: PresupuestoUpdate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    presupuesto = db.query(Presupuesto).filter(
        Presupuesto.id == presupuesto_id,
        Presupuesto.usuario_id == usuario.id
    ).first()
    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(presupuesto, key, value)

    db.commit()
    db.refresh(presupuesto)
    return presupuesto

@router.delete("/{presupuesto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_presupuesto(presupuesto_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    presupuesto = db.query(Presupuesto).filter(
        Presupuesto.id == presupuesto_id,
        Presupuesto.usuario_id == usuario.id
    ).first()
    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")

    db.delete(presupuesto)
    db.commit()
    return