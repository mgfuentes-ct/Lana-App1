from typing import Annotated, Optional
from pydantic import BaseModel, StringConstraints, Field
from pydantic import field_validator  # opcional, para normalizar casing
from datetime import date
from enum import Enum
from decimal import Decimal

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
    # ✅ Decimal con max_digits/decimal_places
    monto: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    categoria: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    frecuencia: FrecuenciaPago
    fecha_inicio: date
    estado: Optional[EstadoPago] = EstadoPago.pendiente
    activo: Optional[bool] = True

    # (Opcional) Normaliza strings en minúsculas/mayúsculas para que el Enum no falle
    @field_validator("frecuencia", mode="before")
    @classmethod
    def _norm_freq(cls, v):
        if isinstance(v, str):
            v_low = v.strip().lower()
            mapa = {
                "diario": FrecuenciaPago.diario,
                "semanal": FrecuenciaPago.semanal,
                "mensual": FrecuenciaPago.mensual,
                "anual": FrecuenciaPago.anual,
            }
            return mapa.get(v_low, v)  # si no coincide, que valide normal y falle
        return v

    @field_validator("estado", mode="before")
    @classmethod
    def _norm_estado(cls, v):
        if isinstance(v, str):
            v_low = v.strip().lower()
            mapa = {
                "pendiente": EstadoPago.pendiente,
                "completado": EstadoPago.completado,
            }
            return mapa.get(v_low, v)
        return v

# Crear pago fijo
class PagoFijoCreate(PagoFijoBase):
    pass

# Actualizar pago fijo
class PagoFijoUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    # ❗️ CORREGIDO: Decimal (no float) + mismas restricciones
    monto: Optional[Annotated[Decimal, Field(max_digits=10, decimal_places=2)]] = None
    categoria: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    frecuencia: Optional[FrecuenciaPago] = None
    fecha_inicio: Optional[date] = None
    estado: Optional[EstadoPago] = None
    activo: Optional[bool] = None

    # (Opcional) mismos normalizadores para updates
    @field_validator("frecuencia", mode="before")
    @classmethod
    def _norm_freq(cls, v):
        if isinstance(v, str):
            v_low = v.strip().lower()
            mapa = {
                "diario": FrecuenciaPago.diario,
                "semanal": FrecuenciaPago.semanal,
                "mensual": FrecuenciaPago.mensual,
                "anual": FrecuenciaPago.anual,
            }
            return mapa.get(v_low, v)
        return v

    @field_validator("estado", mode="before")
    @classmethod
    def _norm_estado(cls, v):
        if isinstance(v, str):
            v_low = v.strip().lower()
            mapa = {
                "pendiente": EstadoPago.pendiente,
                "completado": EstadoPago.completado,
            }
            return mapa.get(v_low, v)
        return v

# Respuesta
class PagoFijoOut(PagoFijoBase):
    id: int

    # 👇 Pydantic v2
    model_config = {"from_attributes": True}
    # (si usas v1, deja:)
    # class Config:
    #     orm_mode = True
