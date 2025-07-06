from pydantic import BaseModel
from datetime import date
from typing import Optional

class PagoFijoBase(BaseModel):
    nombre: str
    monto: float
    categoria: str
    frecuencia: str
    fecha_inicio: date
    estado: Optional[str] = "Pendiente"
    activo: Optional[bool] = True

class PagoFijoCreate(PagoFijoBase):
    pass

class PagoFijoUpdate(PagoFijoBase):
    pass

class PagoFijoResponse(PagoFijoBase):
    id: int

    class Config:
        orm_mode = True