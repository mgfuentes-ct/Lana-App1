from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func
from models.BD import Presupuesto, Categoria
from schemas.presupuestos import PresupuestoCreate, PresupuestoOut, PresupuestoUpdate
from database import SessionLocal
from utils.auth import obtener_usuario_actual

router = APIRouter()

def get_db():
    with SessionLocal() as db:
        yield db

@router.get("/presupuestos/categorias")
def obtener_categorias_presupuesto(db: Session = Depends(get_db)):
    """Obtener categorías disponibles para presupuestos"""
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

@router.get("/presupuestos/resumen")
def obtener_resumen_presupuestos(
    periodo: str = Query("mes", description="Período del resumen"),
    db: Session = Depends(get_db), 
    usuario=Depends(obtener_usuario_actual)
):
    """Obtener resumen de presupuestos del usuario"""
    presupuestos = db.query(Presupuesto)\
        .filter(Presupuesto.usuario_id == usuario.id)\
        .all()
    
    total_presupuestado = sum(p.monto_total for p in presupuestos)
    total_usado = 0  # Aquí podrías calcular el total usado de las transacciones
    
    return {
        "periodo": periodo,
        "total_presupuestado": float(total_presupuestado),
        "total_usado": float(total_usado),
        "porcentaje_usado": (total_usado / total_presupuestado * 100) if total_presupuestado > 0 else 0,
        "cantidad_presupuestos": len(presupuestos)
    }

@router.get("/presupuestos/alertas")
def obtener_alertas_presupuestos(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener alertas de presupuestos (excedidos, próximos a exceder)"""
    presupuestos = db.query(Presupuesto)\
        .filter(Presupuesto.usuario_id == usuario.id)\
        .all()
    
    alertas = []
    for presupuesto in presupuestos:
        # Aquí podrías calcular si está excedido o próximo a exceder
        # Por ahora retornamos información básica
        alertas.append({
            "presupuesto_id": presupuesto.id,
            "categoria": presupuesto.categoria.nombre if presupuesto.categoria else "Sin categoría",
            "monto_total": float(presupuesto.monto_total),
            "estado": "normal"  # normal, proximo_exceder, excedido
        })
    
    return alertas

@router.get("/presupuestos", response_model=List[PresupuestoOut])
def obtener_presupuestos(
    periodo: str = Query("mes", description="Período del presupuesto"),
    db: Session = Depends(get_db), 
    usuario=Depends(obtener_usuario_actual)
):
    """Obtener todos los presupuestos del usuario"""
    presupuestos = db.query(Presupuesto)\
        .filter(Presupuesto.usuario_id == usuario.id)\
        .all()
    return presupuestos

@router.post("/presupuestos", response_model=PresupuestoOut)
def crear_presupuesto(presupuesto: PresupuestoCreate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    nuevo_presupuesto = Presupuesto(**presupuesto.dict(), usuario_id=usuario.id)
    db.add(nuevo_presupuesto)
    db.commit()
    db.refresh(nuevo_presupuesto)
    return nuevo_presupuesto

@router.get("/presupuestos/{presupuesto_id}", response_model=PresupuestoOut)
def obtener_presupuesto(presupuesto_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    presupuesto = db.query(Presupuesto).filter(
        Presupuesto.id == presupuesto_id,
        Presupuesto.usuario_id == usuario.id
    ).first()
    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return presupuesto

@router.put("/presupuestos/{presupuesto_id}", response_model=PresupuestoOut)
def actualizar_presupuesto(presupuesto_id: int, payload: PresupuestoUpdate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
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

@router.delete("/presupuestos/{presupuesto_id}")
def eliminar_presupuesto(presupuesto_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    presupuesto = db.query(Presupuesto).filter(
        Presupuesto.id == presupuesto_id,
        Presupuesto.usuario_id == usuario.id
    ).first()
    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")

    db.delete(presupuesto)
    db.commit()
    return {"mensaje": "Presupuesto eliminado exitosamente"}

# Mantener compatibilidad con las rutas anteriores
@router.post("/", response_model=PresupuestoOut)
def create_presupuesto_old(presupuesto: PresupuestoCreate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Endpoint de compatibilidad - usar /presupuestos en su lugar"""
    return crear_presupuesto(presupuesto, db, usuario)

@router.get("/{presupuesto_id}", response_model=PresupuestoOut)
def get_presupuesto_old(presupuesto_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Endpoint de compatibilidad - usar /presupuestos/{id} en su lugar"""
    return obtener_presupuesto(presupuesto_id, db, usuario)