from typing import Annotated, Optional
from pydantic import BaseModel, StringConstraints, Field
from datetime import date
from enum import Enum

# Enums para valores controlados
class EstadoPago(str, Enum):
    pendiente = "Pendiente"
    completado = "Completado"

class FrecuenciaPago(str, Enum):
    diario = "Diario"
    semanal = "Semanal"
    mensual = "Mensual"
    anual = "Anual"

# Modelo base
class PagoFijoBase(BaseModel):
    nombre: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    monto: Annotated[float, Field(max_digits=10, decimal_places=2)]
    categoria: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    frecuencia: FrecuenciaPago
    fecha_inicio: date
    estado: Optional[EstadoPago] = EstadoPago.pendiente
    activo: Optional[bool] = True


# Crear pago fijo
class PagoFijoCreate(PagoFijoBase):
    pass

# Actualizar pago fijo
class PagoFijoUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    monto: Optional[Annotated[float, Field(max_digits=10, decimal_places=2)]] = None
    categoria: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    frecuencia: Optional[FrecuenciaPago] = None
    fecha_inicio: Optional[date] = None
    estado: Optional[EstadoPago] = None
    activo: Optional[bool] = None

# Respuesta
class PagoFijoOut(PagoFijoBase):
    id: int

    class Config:
        orm_mode = True