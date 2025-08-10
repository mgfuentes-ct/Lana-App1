from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from fastapi.responses import Response

from models.BD import PagoFijo
from database import SessionLocal
from utils.auth import obtener_usuario_actual
from schemas.pagos_fijos import PagoFijoCreate, PagoFijoOut, PagoFijoUpdate

router = APIRouter()

def get_db():
    with SessionLocal() as db:
        yield db

@router.post("/pagos-fijos", response_model=PagoFijoOut)
def crear_pago_fijo(payload: PagoFijoCreate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    nuevo_pago = PagoFijo(usuario_id=usuario.id, **payload.dict())
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago

@router.get("/pagos-fijos", response_model=List[PagoFijoOut])
def listar_pagos_fijos(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    return db.query(PagoFijo).filter(PagoFijo.usuario_id == usuario.id).all()

@router.get("/pagos-fijos/proximos", response_model=List[PagoFijoOut])
def listar_pagos_proximos(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    hoy = date.today()
    return db.query(PagoFijo).filter(
        PagoFijo.usuario_id == usuario.id,
        PagoFijo.fecha_inicio >= hoy,
        PagoFijo.estado == "Pendiente",
        PagoFijo.activo == True
    ).order_by(PagoFijo.fecha_inicio.asc()).limit(5).all()

@router.put("/pagos-fijos/{id}", response_model=PagoFijoOut)
def editar_pago_fijo(id: int, payload: PagoFijoUpdate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(pago, key, value)
    
    db.commit()
    db.refresh(pago)
    return pago

@router.delete("/pagos-fijos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pago_fijo(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    
    db.delete(pago)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)