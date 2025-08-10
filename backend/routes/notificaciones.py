from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

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

# Obtener todas las notificaciones del usuario
@router.get("/notifications", response_model=List[NotificacionOut])
def obtener_notificaciones(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    return db.query(Notificacion)\
        .filter(Notificacion.usuario_id == usuario.id)\
        .order_by(Notificacion.fecha_creacion.desc())\
        .all()

# Obtener configuración actual del usuario (crea si no existe)
@router.get("/notifications/settings", response_model=ConfiguracionNotificacionOut)
def obtener_configuracion(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    config = db.query(ConfiguracionNotificacion).filter(ConfiguracionNotificacion.usuario_id == usuario.id).first()
    if not config:
        config = ConfiguracionNotificacion(usuario_id=usuario.id)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

# Actualizar configuración del usuario
@router.put("/notifications/settings", response_model=ConfiguracionNotificacionOut)
def actualizar_configuracion(payload: ConfiguracionNotificacionUpdate, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    config = db.query(ConfiguracionNotificacion).filter(ConfiguracionNotificacion.usuario_id == usuario.id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(config, key, value)

    db.commit()
    db.refresh(config)
    return config