from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime, timedelta
from fastapi.responses import Response

from models.BD import PagoFijo, Categoria
from database import SessionLocal
from utils.auth import obtener_usuario_actual
from schemas.pagos_fijos import PagoFijoCreate, PagoFijoOut, PagoFijoUpdate

router = APIRouter()

def get_db():
    with SessionLocal() as db:
        yield db

@router.get("/pagos-fijos/proximos")
def listar_pagos_proximos(
    dias: int = Query(30, ge=1, le=365, description="Días hacia adelante para buscar pagos"),
    db: Session = Depends(get_db), 
    usuario=Depends(obtener_usuario_actual)
):
    """Obtener pagos fijos próximos en los próximos N días"""
    hoy = date.today()
    fecha_limite = hoy + timedelta(days=dias)
    
    pagos = db.query(PagoFijo).filter(
        PagoFijo.usuario_id == usuario.id,
        PagoFijo.fecha_inicio >= hoy,
        PagoFijo.fecha_inicio <= fecha_limite,
        PagoFijo.estado == "Pendiente",
        PagoFijo.activo == True
    ).order_by(PagoFijo.fecha_inicio.asc()).all()
    
    return [
        {
            "id": p.id,
            "descripcion": p.descripcion,
            "monto": float(p.monto),
            "fecha_inicio": p.fecha_inicio.isoformat() if p.fecha_inicio else None,
            "frecuencia": p.frecuencia,
            "categoria": p.categoria.nombre if p.categoria else None,
            "estado": p.estado
        }
        for p in pagos
    ]

@router.get("/pagos-fijos/categorias")
def obtener_categorias_pagos_fijos(db: Session = Depends(get_db)):
    """Obtener categorías disponibles para pagos fijos"""
    categorias = db.query(Categoria).filter(Categoria.tipo == 'egreso').all()
    return [
        {
            "id": c.id,
            "nombre": c.nombre,
            "tipo": c.tipo,
            "descripcion": c.descripcion
        }
        for c in categorias
    ]

@router.get("/pagos-fijos/frecuencias")
def obtener_frecuencias_pagos_fijos():
    """Obtener frecuencias disponibles para pagos fijos"""
    return [
        {"id": "diario", "nombre": "Diario", "descripcion": "Todos los días"},
        {"id": "semanal", "nombre": "Semanal", "descripcion": "Cada semana"},
        {"id": "quincenal", "nombre": "Quincenal", "descripcion": "Cada 15 días"},
        {"id": "mensual", "nombre": "Mensual", "descripcion": "Cada mes"},
        {"id": "bimestral", "nombre": "Bimestral", "descripcion": "Cada 2 meses"},
        {"id": "trimestral", "nombre": "Trimestral", "descripcion": "Cada 3 meses"},
        {"id": "semestral", "nombre": "Semestral", "descripcion": "Cada 6 meses"},
        {"id": "anual", "nombre": "Anual", "descripcion": "Cada año"}
    ]

@router.get("/pagos-fijos", response_model=List[PagoFijoOut])
def listar_pagos_fijos(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener todos los pagos fijos del usuario"""
    return db.query(PagoFijo).filter(PagoFijo.usuario_id == usuario.id).all()

@router.post("/pagos-fijos", response_model=PagoFijoOut)
def crear_pago_fijo(payload: PagoFijoCreate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Crear un nuevo pago fijo"""
    nuevo_pago = PagoFijo(usuario_id=usuario.id, **payload.dict())
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago

@router.get("/pagos-fijos/{id}", response_model=PagoFijoOut)
def obtener_pago_fijo(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener un pago fijo específico"""
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    return pago

@router.put("/pagos-fijos/{id}", response_model=PagoFijoOut)
def editar_pago_fijo(id: int, payload: PagoFijoUpdate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Editar un pago fijo existente"""
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(pago, key, value)
    
    db.commit()
    db.refresh(pago)
    return pago

@router.delete("/pagos-fijos/{id}")
def eliminar_pago_fijo(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Eliminar un pago fijo"""
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    
    db.delete(pago)
    db.commit()
    return {"mensaje": "Pago fijo eliminado exitosamente"}

@router.put("/pagos-fijos/{id}/pausar")
def pausar_pago_fijo(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Pausar un pago fijo"""
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    
    pago.activo = False
    db.commit()
    
    return {"mensaje": "Pago fijo pausado exitosamente"}

@router.put("/pagos-fijos/{id}/reanudar")
def reanudar_pago_fijo(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Reanudar un pago fijo pausado"""
    pago = db.query(PagoFijo).filter(PagoFijo.id == id, PagoFijo.usuario_id == usuario.id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")
    
    pago.activo = True
    db.commit()
    
    return {"mensaje": "Pago fijo reanudado exitosamente"}