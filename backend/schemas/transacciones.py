from pydantic import BaseModel
from datetime import date
from typing import Optional

class TransaccionCreate(BaseModel):
    cuenta_id: int
    categoria_id: int
    monto: float
    tipo: str
    descripcion: Optional[str]
    fecha: date

class TransaccionUpdate(BaseModel):
    cuenta_id: Optional[int] = None
    categoria_id: Optional[int] = None
    monto: Optional[float] = None
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha: Optional[date] = None

class TransaccionOut(BaseModel):
    id: int
    cuenta_id: int
    categoria_id: int
    monto: float
    tipo: str
    descripcion: Optional[str]
    fecha: date

    class Config:
        orm_mode = True