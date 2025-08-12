from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, datetime, timedelta

from database import SessionLocal
from models.BD import Transaccion, Categoria, PagoFijo
from utils.auth import obtener_usuario_actual
from schemas.analytics import AnalyticsSummaryResponse, CategoriaTotal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/graficas/ingresos-gastos")
def grafica_ingresos_gastos(
    periodo: str = Query("mes", description="Período de análisis"),
    agrupar_por: str = Query("categoria", description="Agrupar por: categoria, fecha, tipo"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de ingresos vs gastos agrupados por categoría o fecha"""
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
    
    # Consulta base
    query = db.query(Transaccion).filter(
        Transaccion.usuario_id == usuario.id,
        Transaccion.fecha >= fecha_inicio,
        Transaccion.fecha <= fecha_fin
    )
    
    if agrupar_por == "categoria":
        # Agrupar por categoría
        ingresos = db.query(
            Categoria.nombre.label("categoria"),
            func.coalesce(func.sum(Transaccion.monto), 0).label("total")
        ).join(Transaccion, Categoria.id == Transaccion.categoria_id)\
         .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'ingreso', 
                Transaccion.fecha >= fecha_inicio, Transaccion.fecha <= fecha_fin)\
         .group_by(Categoria.nombre).all()
        
        egresos = db.query(
            Categoria.nombre.label("categoria"),
            func.coalesce(func.sum(Transaccion.monto), 0).label("total")
        ).join(Transaccion, Categoria.id == Transaccion.categoria_id)\
         .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'egreso',
                Transaccion.fecha >= fecha_inicio, Transaccion.fecha <= fecha_fin)\
         .group_by(Categoria.nombre).all()
        
        return {
            "periodo": periodo,
            "agrupar_por": agrupar_por,
            "ingresos": [{"categoria": r.categoria, "total": float(r.total)} for r in ingresos],
            "egresos": [{"categoria": r.categoria, "total": float(r.total)} for r in egresos]
        }
    
    return {"error": "Agrupación no implementada"}

@router.get("/graficas/evolucion-temporal")
def grafica_evolucion_temporal(
    periodo: str = Query("mes", description="Período de análisis"),
    metrica: str = Query("balance", description="Métrica a mostrar: balance, ingresos, egresos"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de evolución temporal de una métrica"""
    # Calcular fechas según el período
    hoy = datetime.now().date()
    if periodo == "mes":
        fecha_inicio = hoy.replace(day=1)
        fecha_fin = (fecha_inicio + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        # Agrupar por día
        group_by = func.date(Transaccion.fecha)
    elif periodo == "año":
        fecha_inicio = hoy.replace(month=1, day=1)
        fecha_fin = hoy.replace(month=12, day=31)
        # Agrupar por mes
        group_by = func.strftime('%Y-%m', Transaccion.fecha)
    else:
        return {"error": "Período no soportado"}
    
    if metrica == "balance":
        # Calcular balance diario/mensual
        query = db.query(
            group_by.label("fecha"),
            func.coalesce(func.sum(func.case((Transaccion.tipo == 'ingreso', Transaccion.monto), else_=0)), 0).label("ingresos"),
            func.coalesce(func.sum(func.case((Transaccion.tipo == 'egreso', Transaccion.monto), else_=0)), 0).label("egresos")
        ).filter(
            Transaccion.usuario_id == usuario.id,
            Transaccion.fecha >= fecha_inicio,
            Transaccion.fecha <= fecha_fin
        ).group_by(group_by).order_by(group_by)
        
        datos = query.all()
        return {
            "periodo": periodo,
            "metrica": metrica,
            "datos": [
                {
                    "fecha": str(r.fecha),
                    "balance": float(r.ingresos - r.egresos),
                    "ingresos": float(r.ingresos),
                    "egresos": float(r.egresos)
                }
                for r in datos
            ]
        }
    
    return {"error": "Métrica no implementada"}

@router.get("/graficas/distribucion-categoria")
def grafica_distribucion_categoria(
    periodo: str = Query("mes", description="Período de análisis"),
    tipo: str = Query("gastos", description="Tipo: ingresos o gastos"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de distribución por categoría"""
    # Calcular fechas según el período
    hoy = datetime.now().date()
    if periodo == "mes":
        fecha_inicio = hoy.replace(day=1)
        fecha_fin = (fecha_inicio + timedelta(days=32)).replace(day=1) - timedelta(days=1)
    elif periodo == "año":
        fecha_inicio = hoy.replace(month=1, day=1)
        fecha_fin = hoy.replace(month=12, day=31)
    else:
        return {"error": "Período no soportado"}
    
    # Consultar categorías del tipo especificado
    categorias = db.query(
        Categoria.nombre.label("categoria"),
        func.coalesce(func.sum(Transaccion.monto), 0).label("total")
    ).join(Transaccion, Categoria.id == Transaccion.categoria_id)\
     .filter(
        Transaccion.usuario_id == usuario.id,
        Categoria.tipo == tipo,
        Transaccion.fecha >= fecha_inicio,
        Transaccion.fecha <= fecha_fin
     ).group_by(Categoria.nombre).all()
    
    total = sum(r.total for r in categorias) or 1
    
    return {
        "periodo": periodo,
        "tipo": tipo,
        "datos": [
            {
                "categoria": r.categoria,
                "monto": float(r.total),
                "porcentaje": float(r.total / total * 100)
            }
            for r in categorias
        ]
    }

@router.get("/graficas/comparacion-mensual")
def grafica_comparacion_mensual(
    meses: int = Query(6, ge=1, le=24, description="Número de meses a comparar"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de comparación mensual"""
    hoy = datetime.now().date()
    datos = []
    
    for i in range(meses):
        fecha = hoy.replace(day=1) - timedelta(days=30*i)
        fecha_inicio = fecha.replace(day=1)
        fecha_fin = (fecha_inicio + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        # Calcular ingresos del mes
        ingresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
            .filter(
                Transaccion.usuario_id == usuario.id,
                Transaccion.tipo == 'ingreso',
                Transaccion.fecha >= fecha_inicio,
                Transaccion.fecha <= fecha_fin
            ).scalar()
        
        # Calcular egresos del mes
        egresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
            .filter(
                Transaccion.usuario_id == usuario.id,
                Transaccion.tipo == 'egreso',
                Transaccion.fecha >= fecha_inicio,
                Transaccion.fecha <= fecha_fin
            ).scalar()
        
        datos.append({
            "mes": fecha.strftime("%Y-%m"),
            "ingresos": float(ingresos),
            "egresos": float(egresos),
            "balance": float(ingresos - egresos)
        })
    
    return {
        "meses": meses,
        "datos": list(reversed(datos))  # Del más reciente al más antiguo
    }

@router.get("/graficas/presupuesto-vs-real")
def grafica_presupuesto_vs_real(
    periodo: str = Query("mes", description="Período de análisis"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de presupuesto vs gasto real"""
    # Por ahora retornamos datos básicos
    # En una implementación completa, calcularías el presupuesto vs gasto real
    return {
        "periodo": periodo,
        "datos": [],
        "mensaje": "Funcionalidad en desarrollo"
    }

@router.get("/graficas/tendencias")
def grafica_tendencias(
    periodo: str = Query("año", description="Período de análisis"),
    metrica: str = Query("gastos", description="Métrica: ingresos, gastos, balance"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de tendencias"""
    # Por ahora retornamos datos básicos
    return {
        "periodo": periodo,
        "metrica": metrica,
        "datos": [],
        "mensaje": "Funcionalidad en desarrollo"
    }

@router.get("/graficas/pagos-fijos")
def grafica_pagos_fijos(
    periodo: str = Query("mes", description="Período de análisis"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de pagos fijos"""
    # Por ahora retornamos datos básicos
    return {
        "periodo": periodo,
        "datos": [],
        "mensaje": "Funcionalidad en desarrollo"
    }

@router.get("/graficas/ahorros")
def grafica_ahorros(
    periodo: str = Query("año", description="Período de análisis"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Gráfica de ahorros"""
    # Por ahora retornamos datos básicos
    return {
        "periodo": periodo,
        "datos": [],
        "mensaje": "Funcionalidad en desarrollo"
    }

@router.get("/graficas/metricas")
def graficas_metricas(
    periodo: str = Query("mes", description="Período de análisis"),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Métricas generales para gráficas"""
    # Calcular fechas según el período
    hoy = datetime.now().date()
    if periodo == "mes":
        fecha_inicio = hoy.replace(day=1)
        fecha_fin = (fecha_inicio + timedelta(days=32)).replace(day=1) - timedelta(days=1)
    elif periodo == "año":
        fecha_inicio = hoy.replace(month=1, day=1)
        fecha_fin = hoy.replace(month=12, day=31)
    else:
        return {"error": "Período no soportado"}
    
    # Calcular métricas básicas
    ingresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
        .filter(
            Transaccion.usuario_id == usuario.id,
            Transaccion.tipo == 'ingreso',
            Transaccion.fecha >= fecha_inicio,
            Transaccion.fecha <= fecha_fin
        ).scalar()
    
    egresos = db.query(func.coalesce(func.sum(Transaccion.monto), 0))\
        .filter(
            Transaccion.usuario_id == usuario.id,
            Transaccion.tipo == 'egreso',
            Transaccion.fecha >= fecha_inicio,
            Transaccion.fecha <= fecha_fin
        ).scalar()
    
    return {
        "periodo": periodo,
        "ingresos": float(ingresos),
        "egresos": float(egresos),
        "ahorros": float(ingresos - egresos),
        "total_transacciones": db.query(func.count(Transaccion.id))\
            .filter(
                Transaccion.usuario_id == usuario.id,
                Transaccion.fecha >= fecha_inicio,
                Transaccion.fecha <= fecha_fin
            ).scalar()
    }

# Mantener compatibilidad con la ruta anterior
@router.get("/analytics/summary", response_model=AnalyticsSummaryResponse)
def resumen_analitico_old(
    fecha_inicio: date | None = Query(None),
    fecha_fin: date | None = Query(None),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
    """Endpoint de compatibilidad - usar /graficas/ingresos-gastos en su lugar"""
    filtro_fecha = True
    if fecha_inicio and fecha_fin:
        filtro_fecha = and_(Transaccion.fecha >= fecha_inicio, Transaccion.fecha <= fecha_fin)
    elif fecha_inicio:
        filtro_fecha = Transaccion.fecha >= fecha_inicio
    elif fecha_fin:
        filtro_fecha = Transaccion.fecha <= fecha_fin

    # Ingresos
    ingresos_query = (
        db.query(
            Categoria.nombre.label("categoria"),
            func.coalesce(func.sum(Transaccion.monto), 0).label("total")
        )
        .join(Transaccion, Categoria.id == Transaccion.categoria_id)
        .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'ingreso', filtro_fecha)
        .group_by(Categoria.nombre)
    )
    ingresos = [CategoriaTotal(categoria=r.categoria, total=r.total) for r in ingresos_query.all()]

    # Egresos
    egresos_query = (
        db.query(
            Categoria.nombre.label("categoria"),
            func.coalesce(func.sum(Transaccion.monto), 0).label("total")
        )
        .join(Transaccion, Categoria.id == Transaccion.categoria_id)
        .filter(Transaccion.usuario_id == usuario.id, Transaccion.tipo == 'egreso', filtro_fecha)
        .group_by(Categoria.nombre)
    )
    egresos = [CategoriaTotal(categoria=r.categoria, total=r.total) for r in egresos_query.all()]

    return AnalyticsSummaryResponse(ingresos=ingresos, egresos=egresos)