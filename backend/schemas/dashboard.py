from typing import Annotated
from pydantic import BaseModel, Field
from datetime import date
from decimal import Decimal

# ---- Resumen de pagos fijos ----
class PagoFijoResumen(BaseModel):
    id: int
    nombre: str
    monto: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    fecha_inicio: date
    frecuencia: str
    estado: str

    class Config:
        from_attributes = True

# ---- Resumen por categoría (para gráficas) ----
class CategoriaResumen(BaseModel):
    categoria_id: int
    nombre: str
    tipo: str  # "ingreso" o "egreso"
    monto_total: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    porcentaje: float  # respecto al total

    class Config:
        from_attributes = True

# ---- Resumen de presupuestos ----
class PresupuestoResumen(BaseModel):
    presupuesto_id: int
    categoria_id: int
    categoria_nombre: str
    monto_total: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    monto_usado: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    porcentaje_usado: float
    excedido: bool

    class Config:
        from_attributes = True

# ---- Respuesta completa del dashboard ----
class DashboardResponse(BaseModel):
    total_ingresos: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    total_egresos: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    saldo: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    ingresos_por_categoria: list[CategoriaResumen]
    egresos_por_categoria: list[CategoriaResumen]
    presupuestos: list[PresupuestoResumen]
    pagos_pendientes: list[PagoFijoResumen]
    notificaciones_no_leidas: int

    class Config:
        from_attributes = True