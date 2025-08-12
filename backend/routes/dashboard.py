from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from datetime import date, datetime, timedelta

from database import SessionLocal
from models.BD import Transaccion, PagoFijo, Notificacion, Categoria, Presupuesto
from utils.auth import obtener_usuario_actual
from schemas.dashboard import DashboardResponse, CategoriaResumen, PresupuestoResumen, PagoFijoResumen

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/dashboard/balance")
def obtener_balance(
    db: Session = Depends(get_db),
    usuario = Depends(obtener_usuario_actual)
):
    """Obtener el balance actual del usuario"""
    try:
        # Calcular ingresos totales
        total_ingresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
            .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'ingreso')\
            .scalar()
        
        # Calcular egresos totales
        total_egresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
            .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'egreso')\
            .scalar()
        
        # Calcular balance
        balance = total_ingresos - total_egresos
        
        return {
            "balance": float(balance),
            "ingresos": float(total_ingresos),
            "egresos": float(total_egresos)
        }
    except Exception as e:
        return {"balance": 0, "ingresos": 0, "egresos": 0}

@router.get("/dashboard/transacciones-recientes")
def obtener_transacciones_recientes(
    limite: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
    usuario = Depends(obtener_usuario_actual)
):
    """Obtener las transacciones más recientes del usuario"""
    try:
        transacciones = db.query(Transaccion)\
            .filter(Transaccion.usuario_id == usuario.id)\
            .order_by(Transaccion.fecha.desc())\
            .limit(limite)\
            .all()
        
        return [
            {
                "id": t.id,
                "descripcion": t.descripcion,
                "monto": float(t.monto),
                "tipo": t.tipo,
                "fecha": t.fecha.isoformat() if t.fecha else None,
                "categoria": t.categoria.nombre if t.categoria else None
            }
            for t in transacciones
        ]
    except Exception as e:
        return []

@router.get("/dashboard/resumen")
def obtener_resumen_dashboard(
    periodo: str = Query("mes", regex="^(dia|semana|mes|año)$"),
    db: Session = Depends(get_db),
    usuario = Depends(obtener_usuario_actual)
):
    """Obtener resumen del dashboard según el período especificado"""
    try:
        # Calcular fechas según el período
        hoy = datetime.now().date()
        if periodo == "dia":
            fecha_inicio = hoy
            fecha_fin = hoy
        elif periodo == "semana":
            fecha_inicio = hoy - timedelta(days=hoy.weekday())
            fecha_fin = fecha_inicio + timedelta(days=6)
        elif periodo == "mes":
            fecha_inicio = hoy.replace(day=1)
            fecha_fin = (fecha_inicio + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        elif periodo == "año":
            fecha_inicio = hoy.replace(month=1, day=1)
            fecha_fin = hoy.replace(month=12, day=31)
        
        # Calcular ingresos del período
        ingresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
            .filter(
                Transaccion.usuario_id == usuario.id,
                Transaccion.tipo == 'ingreso',
                Transaccion.fecha >= fecha_inicio,
                Transaccion.fecha <= fecha_fin
            )\
            .scalar()
        
        # Calcular egresos del período
        egresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
            .filter(
                Transaccion.usuario_id == usuario.id,
                Transaccion.tipo == 'egreso',
                Transaccion.fecha >= fecha_inicio,
                Transaccion.fecha <= fecha_fin
            )\
            .scalar()
        
        # Calcular ahorros (ingresos - egresos)
        ahorros = ingresos - egresos
        
        return {
            "periodo": periodo,
            "fecha_inicio": fecha_inicio.isoformat(),
            "fecha_fin": fecha_fin.isoformat(),
            "ingresos": float(ingresos),
            "gastos": float(egresos),
            "ahorros": float(ahorros),
            "total_transacciones": db.query(func.count(Transaccion.id))\
                .filter(
                    Transaccion.usuario_id == usuario.id,
                    Transaccion.fecha >= fecha_inicio,
                    Transaccion.fecha <= fecha_fin
                )\
                .scalar()
        }
    except Exception as e:
        return {
            "periodo": periodo,
            "ingresos": 0,
            "gastos": 0,
            "ahorros": 0,
            "total_transacciones": 0
        }

@router.get("/dashboard", response_model=DashboardResponse)
def obtener_dashboard(
    fecha_inicio: date | None = Query(None),
    fecha_fin: date | None = Query(None),
    db: Session = Depends(get_db),
    usuario = Depends(obtener_usuario_actual)
):
    # Construir filtro para fechas
    filtro_fecha = True  # Siempre True para evitar complicaciones si no hay filtro
    if fecha_inicio and fecha_fin:
        filtro_fecha = and_(Transaccion.fecha >= fecha_inicio, Transaccion.fecha <= fecha_fin)
    elif fecha_inicio:
        filtro_fecha = Transaccion.fecha >= fecha_inicio
    elif fecha_fin:
        filtro_fecha = Transaccion.fecha <= fecha_fin

    # Totales ingresos y egresos con filtro fecha
    totales = db.query(
        func.coalesce(func.sum(case((Transaccion.tipo == 'ingreso', Transaccion.monto))), 0),
        func.coalesce(func.sum(case((Transaccion.tipo == 'egreso', Transaccion.monto))), 0)
    ).filter(Transaccion.usuario_id == usuario.id, filtro_fecha).one()

    total_ingresos, total_egresos = totales
    saldo = total_ingresos - total_egresos

    # Ingresos por categoría con filtro fecha
    ingresos_cat = db.query(
        Categoria.id.label("categoria_id"),
        Categoria.nombre,
        Categoria.tipo,
        func.coalesce(func.sum(Transaccion.monto), 0).label("monto_total")
    ).join(Transaccion, Transaccion.categoria_id == Categoria.id)\
     .filter(Transaccion.usuario_id == usuario.id, Categoria.tipo == 'ingreso', filtro_fecha)\
     .group_by(Categoria.id, Categoria.nombre, Categoria.tipo).all()

    total_ingresos_suma = sum(row.monto_total for row in ingresos_cat) or 1
    ingresos_por_categoria = [
        CategoriaResumen(
            categoria_id=row.categoria_id,
            nombre=row.nombre,
            tipo=row.tipo,
            monto_total=row.monto_total,
            porcentaje=float(row.monto_total) / float(total_ingresos_suma) * 100
        )
        for row in ingresos_cat
    ]

    # Egresos por categoría con filtro fecha
    egresos_cat = db.query(
        Categoria.id.label("categoria_id"),
        Categoria.nombre,
        Categoria.tipo,
        func.coalesce(func.sum(Transaccion.monto), 0).label("monto_total")
    ).join(Transaccion, Transaccion.categoria_id == Categoria.id)\
     .filter(Transaccion.usuario_id == usuario.id, Categoria.tipo == 'egreso', filtro_fecha)\
     .group_by(Categoria.id, Categoria.nombre, Categoria.tipo).all()

    total_egresos_suma = sum(row.monto_total for row in egresos_cat) or 1
    egresos_por_categoria = [
        CategoriaResumen(
            categoria_id=row.categoria_id,
            nombre=row.nombre,
            tipo=row.tipo,
            monto_total=row.monto_total,
            porcentaje=float(row.monto_total) / float(total_egresos_suma) * 100
        )
        for row in egresos_cat
    ]

    # Presupuestos (sin filtro de fechas, porque el presupuesto tiene rango propio)
    presupuestos_db = db.query(
        Presupuesto.id.label("presupuesto_id"),
        Presupuesto.categoria_id,
        Categoria.nombre.label("categoria_nombre"),
        Presupuesto.monto_total,
        func.coalesce(func.sum(Transaccion.monto), 0).label("monto_usado")
    ).join(Categoria, Presupuesto.categoria_id == Categoria.id)\
     .outerjoin(Transaccion, (Transaccion.presupuesto_id == Presupuesto.id) & (Transaccion.usuario_id == usuario.id))\
     .filter(Presupuesto.usuario_id == usuario.id)\
     .group_by(Presupuesto.id, Presupuesto.categoria_id, Categoria.nombre, Presupuesto.monto_total).all()

    presupuestos = [
        PresupuestoResumen(
            presupuesto_id=row.presupuesto_id,
            categoria_id=row.categoria_id,
            categoria_nombre=row.categoria_nombre,
            monto_total=row.monto_total,
            monto_usado=row.monto_usado,
            porcentaje_usado=(float(row.monto_usado) / float(row.monto_total) * 100) if row.monto_total > 0 else 0,
            excedido=row.monto_usado > row.monto_total
        )
        for row in presupuestos_db
    ]

    # Pagos fijos activos y pendientes (filtramos por fecha de inicio dentro del rango si se pasa)
    pagos_query = db.query(PagoFijo).filter(
        PagoFijo.usuario_id == usuario.id,
        PagoFijo.activo == True,
        PagoFijo.estado == 'Pendiente',
    )
    if fecha_inicio:
        pagos_query = pagos_query.filter(PagoFijo.fecha_inicio >= fecha_inicio)
    if fecha_fin:
        pagos_query = pagos_query.filter(PagoFijo.fecha_inicio <= fecha_fin)

    pagos_pendientes = pagos_query.order_by(PagoFijo.fecha_inicio.asc()).limit(5).all()

    # Notificaciones no leídas (sin filtro de fechas)
    notificaciones_no_leidas = db.query(func.count()).select_from(Notificacion)\
        .filter(Notificacion.usuario_id == usuario.id, Notificacion.leido == False)\
        .scalar()

    return DashboardResponse(
        total_ingresos=total_ingresos,
        total_egresos=total_egresos,
        saldo=saldo,
        ingresos_por_categoria=ingresos_por_categoria,
        egresos_por_categoria=egresos_por_categoria,
        presupuestos=presupuestos,
        pagos_pendientes=pagos_pendientes,
        notificaciones_no_leidas=notificaciones_no_leidas
    )