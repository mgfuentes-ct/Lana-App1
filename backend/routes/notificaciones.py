from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func

from database import SessionLocal
from models.BD import Notificacion, ConfiguracionNotificacion
from utils.auth import obtener_usuario_actual
from schemas.notificaciones import (
    NotificacionOut,
    ConfiguracionNotificacionOut,
    ConfiguracionNotificacionUpdate
)

router = APIRouter()

def get_db():
    with SessionLocal() as db:
        yield db

@router.get("/notificaciones/configuracion", response_model=ConfiguracionNotificacionOut)
def obtener_configuracion(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener configuración actual del usuario (crea si no existe)"""
    config = db.query(ConfiguracionNotificacion).filter(ConfiguracionNotificacion.usuario_id == usuario.id).first()
    if not config:
        config = ConfiguracionNotificacion(usuario_id=usuario.id)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.put("/notificaciones/configuracion", response_model=ConfiguracionNotificacionOut)
def actualizar_configuracion(payload: ConfiguracionNotificacionUpdate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Actualizar configuración del usuario"""
    config = db.query(ConfiguracionNotificacion).filter(ConfiguracionNotificacion.usuario_id == usuario.id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(config, key, value)

    db.commit()
    db.refresh(config)
    return config

@router.get("/notificaciones/contador-no-leidas")
def obtener_contador_no_leidas(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener el contador de notificaciones no leídas"""
    contador = db.query(func.count(Notificacion.id))\
        .filter(Notificacion.usuario_id == usuario.id, Notificacion.leido == False)\
        .scalar()
    
    return {"contador": contador}

@router.get("/notificaciones/marcar-todas-leidas")
def marcar_todas_leidas(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Marcar todas las notificaciones del usuario como leídas"""
    db.query(Notificacion)\
        .filter(Notificacion.usuario_id == usuario.id, Notificacion.leido == False)\
        .update({"leido": True})
    db.commit()
    
    return {"mensaje": "Todas las notificaciones marcadas como leídas"}

@router.delete("/notificaciones/eliminar-leidas")
def eliminar_notificaciones_leidas(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Eliminar todas las notificaciones leídas del usuario"""
    db.query(Notificacion)\
        .filter(Notificacion.usuario_id == usuario.id, Notificacion.leido == True)\
        .delete()
    db.commit()
    
    return {"mensaje": "Notificaciones leídas eliminadas exitosamente"}

# Obtener todas las notificaciones del usuario
@router.get("/notificaciones", response_model=List[NotificacionOut])
def obtener_notificaciones(
    pagina: int = Query(1, ge=1, description="Número de página"),
    limite: int = Query(20, ge=1, le=100, description="Elementos por página"),
    solo_no_leidas: bool = Query(False, description="Solo notificaciones no leídas"),
    db: Session = Depends(get_db), 
    usuario=Depends(obtener_usuario_actual)
):
    """Obtener notificaciones con paginación y filtros"""
    query = db.query(Notificacion).filter(Notificacion.usuario_id == usuario.id)
    
    if solo_no_leidas:
        query = query.filter(Notificacion.leido == False)
    
    # Calcular offset para paginación
    offset = (pagina - 1) * limite
    
    notificaciones = query.order_by(Notificacion.fecha_creacion.desc())\
        .offset(offset).limit(limite).all()
    
    return notificaciones

@router.post("/notificaciones", response_model=NotificacionOut)
def crear_notificacion(payload: dict, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Crear una nueva notificación"""
    # Por ahora retornamos éxito
    # En una implementación completa, crearías la notificación
    return {"mensaje": "Notificación creada exitosamente"}

@router.get("/notificaciones/{id}", response_model=NotificacionOut)
def obtener_notificacion(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener una notificación específica"""
    notificacion = db.query(Notificacion)\
        .filter(Notificacion.id == id, Notificacion.usuario_id == usuario.id).first()
    
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    return notificacion

@router.put("/notificaciones/{id}/leer")
def marcar_como_leida(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Marcar una notificación como leída"""
    notificacion = db.query(Notificacion)\
        .filter(Notificacion.id == id, Notificacion.usuario_id == usuario.id).first()
    
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    notificacion.leido = True
    db.commit()
    
    return {"mensaje": "Notificación marcada como leída"}

@router.delete("/notificaciones/{id}")
def eliminar_notificacion(id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Eliminar una notificación"""
    notificacion = db.query(Notificacion)\
        .filter(Notificacion.id == id, Notificacion.usuario_id == usuario.id).first()
    
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    db.delete(notificacion)
    db.commit()
    
    return {"mensaje": "Notificación eliminada exitosamente"}

# Mantener compatibilidad con la ruta anterior
@router.get("/notifications", response_model=List[NotificacionOut])
def obtener_notificaciones_old(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Endpoint de compatibilidad - usar /notificaciones en su lugar"""
    return obtener_notificaciones(db=db, usuario=usuario)