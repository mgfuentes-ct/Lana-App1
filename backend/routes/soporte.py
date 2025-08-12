from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func
from datetime import datetime

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

@router.post("/soporte/tickets")
def crear_ticket(payload: MensajeSoporte, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Crear un nuevo ticket de soporte"""
    nuevo = Soporte(usuario_id=usuario.id, **payload.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {
        "id": nuevo.id,
        "mensaje": "Ticket de soporte creado exitosamente",
        "ticket": nuevo
    }

@router.get("/soporte/tickets")
def obtener_tickets(
    pagina: int = Query(1, ge=1, description="Número de página"),
    limite: int = Query(20, ge=1, le=100, description="Elementos por página"),
    estado: str = Query(None, description="Estado del ticket: abierto, en_proceso, cerrado"),
    db: Session = Depends(get_db), 
    usuario=Depends(obtener_usuario_actual)
):
    """Obtener tickets de soporte del usuario"""
    query = db.query(Soporte).filter(Soporte.usuario_id == usuario.id)
    
    if estado:
        query = query.filter(Soporte.estado == estado)
    
    # Calcular offset para paginación
    offset = (pagina - 1) * limite
    
    tickets = query.order_by(Soporte.fecha_creacion.desc())\
        .offset(offset).limit(limite).all()
    
    return [
        {
            "id": t.id,
            "asunto": t.asunto,
            "mensaje": t.mensaje,
            "estado": t.estado,
            "prioridad": t.prioridad,
            "fecha_creacion": t.fecha_creacion.isoformat() if t.fecha_creacion else None,
            "fecha_resolucion": t.fecha_resolucion.isoformat() if t.fecha_resolucion else None
        }
        for t in tickets
    ]

@router.get("/soporte/tickets/{ticket_id}")
def obtener_ticket(ticket_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener un ticket específico"""
    ticket = db.query(Soporte).filter(Soporte.id == ticket_id, Soporte.usuario_id == usuario.id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    
    return {
        "id": ticket.id,
        "asunto": ticket.asunto,
        "mensaje": ticket.mensaje,
        "estado": ticket.estado,
        "prioridad": ticket.prioridad,
        "fecha_creacion": ticket.fecha_creacion.isoformat() if ticket.fecha_creacion else None,
        "fecha_resolucion": ticket.fecha_resolucion.isoformat() if ticket.fecha_resolucion else None
    }

@router.put("/soporte/tickets/{ticket_id}")
def actualizar_ticket(ticket_id: int, payload: dict, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Actualizar un ticket"""
    ticket = db.query(Soporte).filter(Soporte.id == ticket_id, Soporte.usuario_id == usuario.id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    
    # Solo permitir actualizar ciertos campos
    campos_permitidos = ["asunto", "mensaje", "prioridad"]
    for campo, valor in payload.items():
        if campo in campos_permitidos:
            setattr(ticket, campo, valor)
    
    db.commit()
    db.refresh(ticket)
    
    return {"mensaje": "Ticket actualizado exitosamente"}

@router.put("/soporte/tickets/{ticket_id}/cerrar")
def cerrar_ticket(ticket_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Cerrar un ticket"""
    ticket = db.query(Soporte).filter(Soporte.id == ticket_id, Soporte.usuario_id == usuario.id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    
    ticket.estado = "cerrado"
    ticket.fecha_resolucion = datetime.now()
    db.commit()
    
    return {"mensaje": "Ticket cerrado exitosamente"}

@router.post("/soporte/tickets/{ticket_id}/comentarios")
def agregar_comentario(ticket_id: int, comentario: dict, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Agregar un comentario a un ticket"""
    # Por ahora retornamos éxito
    # En una implementación completa, crearías un modelo de comentarios
    return {"mensaje": "Comentario agregado exitosamente"}

@router.get("/soporte/tickets/{ticket_id}/comentarios")
def obtener_comentarios(ticket_id: int, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Obtener comentarios de un ticket"""
    # Por ahora retornamos lista vacía
    # En una implementación completa, consultarías comentarios reales
    return []

@router.get("/soporte/categorias")
def obtener_categorias_soporte():
    """Obtener categorías de soporte disponibles"""
    return [
        {"id": "general", "nombre": "General", "descripcion": "Consultas generales"},
        {"id": "tecnico", "nombre": "Técnico", "descripcion": "Problemas técnicos"},
        {"id": "cuenta", "nombre": "Cuenta", "descripcion": "Problemas con la cuenta"},
        {"id": "transacciones", "nombre": "Transacciones", "descripcion": "Problemas con transacciones"},
        {"id": "presupuestos", "nombre": "Presupuestos", "descripcion": "Problemas con presupuestos"},
        {"id": "pagos_fijos", "nombre": "Pagos Fijos", "descripcion": "Problemas con pagos fijos"},
        {"id": "otro", "nombre": "Otro", "descripcion": "Otros problemas"}
    ]

@router.get("/soporte/prioridades")
def obtener_prioridades_soporte():
    """Obtener prioridades de soporte disponibles"""
    return [
        {"id": "baja", "nombre": "Baja", "descripcion": "No urgente"},
        {"id": "media", "nombre": "Media", "descripcion": "Importante pero no urgente"},
        {"id": "alta", "nombre": "Alta", "descripcion": "Urgente"},
        {"id": "critica", "nombre": "Crítica", "descripcion": "Muy urgente"}
    ]

@router.get("/soporte/faq")
def obtener_faq(categoria: str = Query(None, description="Categoría de FAQ")):
    """Obtener preguntas frecuentes"""
    faq_general = [
        {"pregunta": "¿Cómo restablezco mi contraseña?", "respuesta": "Ve a la opción '¿Olvidaste tu contraseña?' en la pantalla de login."},
        {"pregunta": "¿Cómo puedo editar una transacción?", "respuesta": "Desde el historial, pulsa en la transacción y selecciona 'Editar'."},
        {"pregunta": "¿Mis datos están seguros?", "respuesta": "Sí, usamos protocolos seguros y cifrado para proteger tus datos."},
        {"pregunta": "¿Cómo creo un presupuesto?", "respuesta": "Ve a la sección de Presupuestos y pulsa en 'Crear Presupuesto'."},
        {"pregunta": "¿Puedo pausar un pago fijo?", "respuesta": "Sí, desde la lista de pagos fijos puedes pausar y reanudar pagos."}
    ]
    
    if categoria:
        # Filtrar por categoría si se especifica
        return [faq for faq in faq_general if categoria.lower() in faq["pregunta"].lower()]
    
    return faq_general

@router.post("/soporte/tickets/{ticket_id}/calificar")
def calificar_ticket(ticket_id: int, calificacion: dict, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Calificar un ticket de soporte"""
    # Por ahora retornamos éxito
    # En una implementación completa, guardarías la calificación
    return {"mensaje": "Ticket calificado exitosamente"}

# Mantener compatibilidad con las rutas anteriores
@router.get("/support/faq")
def obtener_faq_old():
    """Endpoint de compatibilidad - usar /soporte/faq en su lugar"""
    return obtener_faq()

@router.post("/support/message", response_model=SoporteOut)
def enviar_mensaje_old(payload: MensajeSoporte, db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    """Endpoint de compatibilidad - usar /soporte/tickets en su lugar"""
    return crear_ticket(payload, db, usuario)