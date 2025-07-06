from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from backend.database import SessionLocal
from backend.models.BD import Transaccion, PagoFijo, Notificacion
from backend.utils.auth import obtener_usuario_actual
from backend.schemas.dashboard import DashboardResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/dashboard", response_model=DashboardResponse)
def obtener_dashboard(db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    # Total ingresos
    ingresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
        .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'ingreso')\
        .scalar()

    # Total egresos
    egresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
        .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'egreso')\
        .scalar()

    # Saldo
    saldo = ingresos - egresos

    # Próximos pagos fijos activos y pendientes
    pagos = db.query(PagoFijo).filter(
        PagoFijo.usuario_id == usuario.id,
        PagoFijo.activo == True,
        PagoFijo.estado == 'Pendiente',
        PagoFijo.fecha_inicio >= date.today()
    ).order_by(PagoFijo.fecha_inicio.asc()).limit(5).all()

    # Notificaciones no leídas
    notificaciones = db.query(func.count()).select_from(Notificacion)\
        .filter(Notificacion.usuario_id == usuario.id, Notificacion.leido == False)\
        .scalar()

    return DashboardResponse(
        total_ingresos=float(ingresos),
        total_egresos=float(egresos),
        saldo=float(saldo),
        pagos_pendientes=pagos,
        notificaciones_no_leidas=notificaciones
    )