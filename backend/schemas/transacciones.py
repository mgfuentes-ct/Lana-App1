from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class TipoTransaccion(str, Enum):
    ingreso = "ingreso"
    egreso = "egreso"

class TransaccionCreate(BaseModel):
    usuario_id: int   # Ajustar aquí si usas usuario_id
    presupuesto_id: Optional[int] = None
    categoria_id: int
    monto: float
    tipo: TipoTransaccion
    descripcion: Optional[str] = None
    fecha: date

class TransaccionUpdate(BaseModel):
    presupuesto_id: Optional[int] = None
    categoria_id: Optional[int] = None
    monto: Optional[float] = None
    tipo: Optional[TipoTransaccion] = None
    descripcion: Optional[str] = None
    fecha: Optional[date] = None

class TransaccionOut(BaseModel):
    id: int
    usuario_id: int
    presupuesto_id: Optional[int]
    categoria_id: int
    monto: float
    tipo: TipoTransaccion
    descripcion: Optional[str]
    fecha: date

    class Config:
        orm_mode = True