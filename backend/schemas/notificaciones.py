from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Notificación individual
class NotificacionResponse(BaseModel):
    id: int
    mensaje: str
    leido: bool
    fecha_creacion: datetime

    class Config:
        orm_mode = True

# Configuración del usuario
class ConfiguracionNotificacionResponse(BaseModel):
    email: bool
    sms: bool
    recordatorios: bool

    class Config:
        orm_mode = True

class ConfiguracionNotificacionUpdate(BaseModel):
    email: Optional[bool] = None
    sms: Optional[bool] = None
    recordatorios: Optional[bool] = None