from typing import Annotated
from pydantic import BaseModel, EmailStr, StringConstraints
from datetime import datetime
from typing import Optional
from enum import Enum

# Enum para roles
class RolUsuario(str, Enum):
    usuario = "usuario"
    admin = "admin"

# Modelo para creación de usuario (registro)
class UsuarioCreate(BaseModel):
    nombre: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    correo: EmailStr
    contrasena: Annotated[str, StringConstraints(min_length=6)]  # El hashing se hace en la lógica de la API
    rol: Optional[RolUsuario] = RolUsuario.usuario

# Modelo para login
class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str

# Modelo para actualizar perfil
class UsuarioUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = None
    correo: Optional[EmailStr] = None
    contrasena: Optional[Annotated[str, StringConstraints(min_length=6)]] = None
    rol: Optional[RolUsuario] = None  # Solo un admin debería poder cambiarlo

# Modelo para mostrar datos del usuario (respuesta)
class UsuarioOut(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    rol: RolUsuario
    fecha_registro: datetime

    class Config:
        from_attributes = True