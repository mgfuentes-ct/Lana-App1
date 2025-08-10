from typing import Annotated, Optional
from pydantic import BaseModel, StringConstraints
from datetime import datetime

# Schema para creación: Sin usuario_id, porque se asigna en backend
class MensajeSoporte(BaseModel):
    asunto: Annotated[str, StringConstraints(min_length=3, max_length=100)]
    mensaje: Annotated[str, StringConstraints(min_length=5)]

# Schema para actualización (opcional)
class SoporteUpdate(BaseModel):
    asunto: Optional[Annotated[str, StringConstraints(min_length=3, max_length=100)]] = None
    mensaje: Optional[Annotated[str, StringConstraints(min_length=5)]] = None

# Schema para respuesta con todos los campos y orm_mode activado
class SoporteOut(BaseModel):
    id: int
    usuario_id: int
    asunto: Annotated[str, StringConstraints(min_length=3, max_length=100)]
    mensaje: Annotated[str, StringConstraints(min_length=5)]
    fecha_envio: datetime

    class Config:
        orm_mode = True