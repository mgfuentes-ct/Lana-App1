from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.BD import Soporte
from utils.auth import obtener_usuario_actual
from schemas.soporte import MensajeSoporte, SoporteOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Preguntas frecuentes estáticas
@router.get("/support/faq")
def obtener_faq():
    return [
        {"pregunta": "¿Cómo restablezco mi contraseña?", "respuesta": "Ve a la opción '¿Olvidaste tu contraseña?' en la pantalla de login."},
        {"pregunta": "¿Cómo puedo editar una transacción?", "respuesta": "Desde el historial, pulsa en la transacción y selecciona 'Editar'."},
        {"pregunta": "¿Mis datos están seguros?", "respuesta": "Sí, usamos protocolos seguros y cifrado para proteger tus datos."}
    ]

# Crear mensaje de soporte
@router.post("/support/message", response_model=SoporteOut)
def enviar_mensaje(payload: MensajeSoporte, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    nuevo = Soporte(usuario_id=usuario.id, **payload.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo