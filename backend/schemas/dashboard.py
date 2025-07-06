from pydantic import BaseModel
from datetime import date
from typing import List

class PagoFijoResumen(BaseModel):
    id: int
    nombre: str
    monto: float
    fecha_inicio: date
    frecuencia: str
    estado: str

    class Config:
        orm_mode = True

class DashboardResponse(BaseModel):
    total_ingresos: float
    total_egresos: float
    saldo: float
    pagos_pendientes: List[PagoFijoResumen]
    notificaciones_no_leidas: int