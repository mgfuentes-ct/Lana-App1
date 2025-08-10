from typing import Annotated, Optional
from pydantic import BaseModel, StringConstraints, Field
from datetime import date

class PresupuestoBase(BaseModel):
    categoria_id: int
    nombre: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    monto_total: Annotated[float, Field(max_digits=10, decimal_places=2)]
    fecha_inicio: date
    fecha_fin: date

class PresupuestoCreate(PresupuestoBase):
    pass

class PresupuestoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    nombre: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    monto_total: Optional[Annotated[float, Field(max_digits=10, decimal_places=2)]] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None

class PresupuestoOut(PresupuestoBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True