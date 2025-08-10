from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date

from database import SessionLocal
from models.BD import Transaccion, Categoria
from utils.auth import obtener_usuario_actual
from schemas.analytics import AnalyticsSummaryResponse, CategoriaTotal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/analytics/summary", response_model=AnalyticsSummaryResponse)
def resumen_analitico(
    fecha_inicio: date | None = Query(None),
    fecha_fin: date | None = Query(None),
    db: Session = Depends(get_db),
    usuario=Depends(obtener_usuario_actual)
):
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