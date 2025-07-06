from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.models.BD import Transaccion
from backend.schemas.transacciones import TransaccionCreate, TransaccionOut, TransaccionUpdate
from backend.database import SessionLocal
from backend.utils.auth import obtener_usuario_actual
from backend.models.BD import Transaccion, CuentaBancaria, Categoria


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/transactions", response_model=List[TransaccionOut])
def obtener_transacciones(db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    return db.query(Transaccion).filter(Transaccion.usuario_id == usuario.id).all()

@router.get("/transactions/{id}", response_model=TransaccionOut)
def detalle_transaccion(id: int, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    transaccion = db.query(Transaccion).filter(Transaccion.id == id, Transaccion.usuario_id == usuario.id).first()
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    return transaccion


@router.post("/transactions", response_model=TransaccionOut)
def crear_transaccion(data: TransaccionCreate, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    # Validar cuenta bancaria
    cuenta = db.query(CuentaBancaria).filter(
        CuentaBancaria.id == data.cuenta_id,
        CuentaBancaria.usuario_id == usuario.id
    ).first()
    if not cuenta:
        raise HTTPException(status_code=400, detail="Cuenta bancaria no válida para este usuario")

    # Validar categoría
    categoria = db.query(Categoria).filter(Categoria.id == data.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=400, detail="Categoría no encontrada")

    # Validar coincidencia entre tipo y categoría
    if categoria.tipo != data.tipo:
        raise HTTPException(status_code=400, detail=f"La categoría es de tipo '{categoria.tipo}', pero enviaste '{data.tipo}'")

    # Validar monto positivo
    if data.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero")

    nueva = Transaccion(**data.dict(), usuario_id=usuario.id)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.put("/transactions/{id}", response_model=TransaccionOut)
def editar_transaccion(id: int, data: TransaccionUpdate, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    transaccion = db.query(Transaccion).filter(
        Transaccion.id == id,
        Transaccion.usuario_id == usuario.id
    ).first()
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada o no pertenece al usuario")

    cambios = data.dict(exclude_unset=True)

    # Validar cuenta si se quiere cambiar
    if 'cuenta_id' in cambios:
        cuenta = db.query(CuentaBancaria).filter(
            CuentaBancaria.id == cambios['cuenta_id'],
            CuentaBancaria.usuario_id == usuario.id
        ).first()
        if not cuenta:
            raise HTTPException(status_code=400, detail="Cuenta bancaria no válida para este usuario")

    # Validar categoría si se cambia
    if 'categoria_id' in cambios:
        categoria = db.query(Categoria).filter(Categoria.id == cambios['categoria_id']).first()
        if not categoria:
            raise HTTPException(status_code=400, detail="Categoría no encontrada")
        # Si también mandaron tipo, lo validamos
        tipo_nuevo = cambios.get('tipo', transaccion.tipo)
        if categoria.tipo != tipo_nuevo:
            raise HTTPException(status_code=400, detail=f"La categoría es de tipo '{categoria.tipo}', pero enviaste '{tipo_nuevo}'")

    # Validar monto si se cambia
    if 'monto' in cambios and cambios['monto'] <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero")

    for campo, valor in cambios.items():
        setattr(transaccion, campo, valor)

    db.commit()
    db.refresh(transaccion)
    return transaccion

@router.delete("/transactions/{id}")
def eliminar_transaccion(id: int, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    transaccion = db.query(Transaccion).filter(Transaccion.id == id, Transaccion.usuario_id == usuario.id).first()
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")

    db.delete(transaccion)
    db.commit()
    return {"mensaje": "Transacción eliminada correctamente"}