from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from backend.database import SessionLocal
from backend.models.BD import Transaccion, Categoria
from backend.utils.auth import obtener_usuario_actual

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/analytics/summary")
def resumen_analitico(db: Session = Depends(get_db), usuario=Depends(obtener_usuario_actual)):
    resultados = (
        db.query(
            Categoria.nombre.label("categoria"),
            Transaccion.tipo,
            func.sum(Transaccion.monto).label("total")
        )
        .join(Categoria, Categoria.id == Transaccion.categoria_id)
        .filter(Transaccion.usuario_id == usuario.id)
        .group_by(Categoria.nombre, Transaccion.tipo)
        .all()
    )

    resumen = []
    for fila in resultados:
        resumen.append({
            "categoria": fila.categoria,
            "tipo": fila.tipo,
            "total": float(fila.total)
        })

    return resumen