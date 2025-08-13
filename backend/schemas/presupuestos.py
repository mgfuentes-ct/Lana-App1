# models/schemas.py (o donde definas los schemas)
from typing import Annotated, Optional
from pydantic import BaseModel, StringConstraints, Field
from datetime import date
from decimal import Decimal
from enum import Enum

# ---------- PRESUPUESTOS ----------
class PresupuestoBase(BaseModel):
    categoria_id: int
    nombre: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    # Usar Decimal con max_digits/decimal_places
    monto_total: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    fecha_inicio: date
    fecha_fin: date

class PresupuestoCreate(PresupuestoBase):
    pass

class PresupuestoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    nombre: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    monto_total: Optional[Annotated[Decimal, Field(max_digits=10, decimal_places=2)]] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None

class PresupuestoOut(PresupuestoBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True  # (en Pydantic v2 también puedes usar: model_config = {"from_attributes": True})

# ---------- PAGOS FIJOS ----------
class EstadoPago(str, Enum):
    pendiente = "Pendiente"
    completado = "Completado"

class FrecuenciaPago(str, Enum):
    diario = "Diario"
    semanal = "Semanal"
    mensual = "Mensual"
    anual = "Anual"

class PagoFijoBase(BaseModel):
    nombre: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    # También Decimal aquí
    monto: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    categoria: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    frecuencia: FrecuenciaPago
    fecha_inicio: date
    estado: Optional[EstadoPago] = EstadoPago.pendiente
    activo: Optional[bool] = True

class PagoFijoCreate(PagoFijoBase):
    pass

class PagoFijoUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    monto: Optional[Annotated[Decimal, Field(max_digits=10, decimal_places=2)]] = None
    categoria: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    frecuencia: Optional[FrecuenciaPago] = None
    fecha_inicio: Optional[date] = None
    estado: Optional[EstadoPago] = None
    activo: Optional[bool] = None

class PagoFijoOut(PagoFijoBase):
    id: int

    class Config:
        orm_mode = True
