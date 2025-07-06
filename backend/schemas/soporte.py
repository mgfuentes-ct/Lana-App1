from pydantic import BaseModel
from datetime import datetime

class MensajeSoporte(BaseModel):
    asunto: str
    mensaje: str

class SoporteResponse(BaseModel):
    id: int
    asunto: str
    mensaje: str
    fecha_envio: datetime

    class Config:
        orm_mode = True