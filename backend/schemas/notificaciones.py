from typing import Annotated, Optional
from pydantic import BaseModel, StringConstraints
from datetime import datetime

# ---- NOTIFICACIONES ----
class NotificacionBase(BaseModel):
    usuario_id: int
    mensaje: Annotated[str, StringConstraints(min_length=1)]
    leido: Optional[bool] = False

class NotificacionCreate(NotificacionBase):
    pass

class NotificacionUpdate(BaseModel):
    mensaje: Optional[Annotated[str, StringConstraints(min_length=1)]] = None
    leido: Optional[bool] = None

class NotificacionOut(NotificacionBase):
    id: int
    fecha_creacion: datetime

    class Config:
        orm_mode = True

# ---- CONFIGURACIÓN DE NOTIFICACIONES ----
class ConfiguracionNotificacionBase(BaseModel):
    usuario_id: int
    email: bool = True
    sms: bool = False
    recordatorios: bool = True

class ConfiguracionNotificacionCreate(ConfiguracionNotificacionBase):
    pass

class ConfiguracionNotificacionUpdate(BaseModel):
    email: Optional[bool] = None
    sms: Optional[bool] = None
    recordatorios: Optional[bool] = None

class ConfiguracionNotificacionOut(ConfiguracionNotificacionBase):
    id: int

    class Config:
        orm_mode = True