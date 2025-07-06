from pydantic import BaseModel
from typing import Optional

class CuentaCreate(BaseModel):
    nombre_banco: str
    numero_cuenta: str
    tipo_cuenta: str

class CuentaResponse(CuentaCreate):
    id: int

    class Config:
        orm_mode = True