from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func

from models.BD import Transaccion, Presupuesto, Categoria
from schemas.transacciones import TransaccionCreate, TransaccionOut, TransaccionUpdate
from database import SessionLocal
from utils.auth import obtener_usuario_actual

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/transacciones/categorias")
def obtener_categorias(db: Session = Depends(get_db)):
    """Obtener todas las categorías disponibles"""
    categorias = db.query(Categoria).all()
    return [
        {
            "id": c.id,
            "nombre": c.nombre,
            "tipo": c.tipo
        }
        for c in categorias
    ]

@router.get("/transacciones/tipos")
def obtener_tipos_transaccion():
    """Obtener los tipos de transacción disponibles"""
    return [
        {"id": "ingreso", "nombre": "Ingreso", "descripcion": "Dinero que entra"},
        {"id": "egreso", "nombre": "Egreso", "descripcion": "Dinero que sale"}
    ]

@router.get("/transacciones", response_model=List[TransaccionOut])
def obtener_transacciones(
    fecha_inicio: str = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    fecha_fin: str = Query(None, description="Fecha de fin (YYYY-MM-DD)"),
    tipo: str = Query(None, description="Tipo de transacción (ingreso/egreso)"),
    categoria: int = Query(None, description="ID de la categoría"),
    monto_min: float = Query(None, description="Monto mínimo"),
    monto_max: float = Query(None, description="Monto máximo"),
    db: Session = Depends(get_db), 
    usuario = Depends(obtener_usuario_actual)
):
    """Obtener transacciones con filtros opcionales"""
    query = db.query(Transaccion).filter(Transaccion.usuario_id == usuario.id)
    
    if fecha_inicio:
        query = query.filter(Transaccion.fecha >= fecha_inicio)
    if fecha_fin:
        query = query.filter(Transaccion.fecha <= fecha_fin)
    if tipo:
        query = query.filter(Transaccion.tipo == tipo)
    if categoria:
        query = query.filter(Transaccion.categoria_id == categoria)
    if monto_min is not None:
        query = query.filter(Transaccion.monto >= monto_min)
    if monto_max is not None:
        query = query.filter(Transaccion.monto <= monto_max)
    
    return query.order_by(Transaccion.fecha.desc()).all()

@router.post("/transacciones", response_model=TransaccionOut)
def crear_transaccion(data: TransaccionCreate, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    # Validar que el usuario del payload coincida con el autenticado
    if data.usuario_id != usuario.id:
        raise HTTPException(status_code=403, detail="No autorizado para crear transacciones de otro usuario")

    # Validar presupuesto (cuenta)
    cuenta = None
    if data.presupuesto_id is not None:
        cuenta = db.query(Presupuesto).filter(
            Presupuesto.id == data.presupuesto_id,
            Presupuesto.usuario_id == usuario.id
        ).first()
        if not cuenta:
            raise HTTPException(status_code=400, detail="Presupuesto no válido para este usuario")

    # Validar categoría
    categoria = db.query(Categoria).filter(Categoria.id == data.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=400, detail="Categoría no encontrada")

    # Validar coincidencia tipo
    if categoria.tipo != data.tipo:
        raise HTTPException(status_code=400, detail=f"La categoría es de tipo '{categoria.tipo}', pero enviaste '{data.tipo}'")

    # Validar monto positivo
    if data.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero")

    nueva = Transaccion(**data.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/transacciones/{id}", response_model=TransaccionOut)
def detalle_transaccion(id: int, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    transaccion = db.query(Transaccion).filter(Transaccion.id == id, Transaccion.usuario_id == usuario.id).first()
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    return transaccion

@router.put("/transacciones/{id}", response_model=TransaccionOut)
def editar_transaccion(id: int, data: TransaccionUpdate, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    transaccion = db.query(Transaccion).filter(
        Transaccion.id == id,
        Transaccion.usuario_id == usuario.id
    ).first()
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada o no pertenece al usuario")

    cambios = data.dict(exclude_unset=True)

    # Validar presupuesto si se cambia
    if 'presupuesto_id' in cambios:
        cuenta = db.query(Presupuesto).filter(
            Presupuesto.id == cambios['presupuesto_id'],
            Presupuesto.usuario_id == usuario.id
        ).first()
        if not cuenta:
            raise HTTPException(status_code=400, detail="Presupuesto no válido para este usuario")

    # Validar categoría si se cambia
    if 'categoria_id' in cambios:
        categoria = db.query(Categoria).filter(Categoria.id == cambios['categoria_id']).first()
        if not categoria:
            raise HTTPException(status_code=400, detail="Categoría no encontrada")
        tipo_nuevo = cambios.get('tipo', transaccion.tipo)
        if categoria.tipo != tipo_nuevo:
            raise HTTPException(status_code=400, detail=f"La categoría es de tipo '{categoria.tipo}', pero enviaste '{tipo_nuevo}'")

    # Validar monto si se cambia
    if 'monto' in cambios:
        if cambios['monto'] <= 0:
            raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero")
        if cambios['monto'] > 999999999.99:
            raise HTTPException(status_code=400, detail="El monto no puede ser mayor a $999,999,999.99")

    for campo, valor in cambios.items():
        setattr(transaccion, campo, valor)

    db.commit()
    db.refresh(transaccion)
    return transaccion

@router.delete("/transacciones/{id}")
def eliminar_transaccion(id: int, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    transaccion = db.query(Transaccion).filter(Transaccion.id == id, Transaccion.usuario_id == usuario.id).first()
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")

    db.delete(transaccion)
    db.commit()
    return {"mensaje": "Transacción eliminada correctamente"}

# Mantener compatibilidad con la ruta anterior
@router.get("/transactions", response_model=List[TransaccionOut])
def obtener_transacciones_old(db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    """Endpoint de compatibilidad - usar /transacciones en su lugar"""
    return obtener_transacciones(db=db, usuario=usuario)