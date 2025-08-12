from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import SessionLocal
from models.BD import Usuario, Sesion, Recuperacion
from passlib.hash import bcrypt
from schemas.usuarios import UsuarioCreate, UsuarioOut, UsuarioUpdate, UsuarioLogin
from utils.jwt import crear_token
from fastapi.security import OAuth2PasswordRequestForm
from utils.auth import obtener_usuario_actual, get_token_actual
from datetime import datetime, timedelta
import secrets

router = APIRouter()

def get_db():
    with SessionLocal() as db:
        yield db

@router.post("/auth/register", response_model=UsuarioOut)
def registrar_usuario(user: UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.correo == user.correo).first()
    if existente:
        raise HTTPException(status_code=400, detail="Correo ya registrado")

    nuevo_usuario = Usuario(
        nombre=user.nombre,
        correo=user.correo,
        contrasena=bcrypt.hash(user.contrasena),
        rol=user.rol or "usuario"
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.post("/auth/login")
def login(user_data: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == user_data.correo).first()
    
    if not usuario or not bcrypt.verify(user_data.contrasena, usuario.contrasena):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = crear_token({"sub": str(usuario.id)})
    
    # Retornar también información del usuario para el frontend
    return {
        "access_token": token, 
        "token_type": "bearer",
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "correo": usuario.correo,
            "rol": usuario.rol
        }
    }

@router.post("/auth/logout")
def logout():
    # Para una implementación simple, solo retornamos éxito
    # En una implementación más robusta, podrías invalidar el token
    return {"mensaje": "Sesión cerrada correctamente"}

@router.get("/auth/validate-token")
def validar_token(usuario = Depends(obtener_usuario_actual)):
    return {"mensaje": "Token válido", "usuario_id": usuario.id}

@router.post("/auth/forgot-password")
def forgot_password(correo: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Correo no registrado")

    token = secrets.token_urlsafe(32)
    expiracion = datetime.utcnow() + timedelta(minutes=30)

    nueva = Recuperacion(usuario_id=usuario.id, token=token, expiracion=expiracion)
    db.add(nueva)
    db.commit()

    # Aquí enviarías el token por correo real.
    return {"mensaje": "Token generado", "token": token}

@router.post("/auth/reset-password")
def reset_password(token: str, nueva_contrasena: str, db: Session = Depends(get_db)):
    rec = db.query(Recuperacion).filter(Recuperacion.token == token, Recuperacion.usado == False).first()

    if not rec or rec.expiracion < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    usuario = db.query(Usuario).filter(Usuario.id == rec.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.contrasena = bcrypt.hash(nueva_contrasena)  # Aquí hasheamos la nueva contraseña
    rec.usado = True
    db.commit()

    return {"mensaje": "Contraseña actualizada correctamente"}

@router.get("/users/me", response_model=UsuarioOut)
def get_perfil(usuario = Depends(obtener_usuario_actual)):
    return usuario

@router.put("/users/me", response_model=UsuarioOut)
def actualizar_perfil(payload: UsuarioUpdate, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    if payload.correo:
        # Verificar que el nuevo correo no esté en uso
        existente = db.query(Usuario).filter(Usuario.correo == payload.correo, Usuario.id != usuario.id).first()
        if existente:
            raise HTTPException(status_code=400, detail="Correo ya en uso")

    for key, value in payload.dict(exclude_unset=True).items():
        if key == "contrasena":
            setattr(usuario, key, bcrypt.hash(value))
        else:
            setattr(usuario, key, value)

    db.commit()
    db.refresh(usuario)
    return usuario

@router.get("/usuarios/perfil")
def obtener_perfil_usuario(usuario = Depends(obtener_usuario_actual)):
    """Obtener perfil completo del usuario"""
    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "correo": usuario.correo,
        "rol": usuario.rol,
        "fecha_registro": usuario.fecha_registro.isoformat() if usuario.fecha_registro else None,
        "ultimo_acceso": usuario.ultimo_acceso.isoformat() if usuario.ultimo_acceso else None
    }

@router.put("/usuarios/perfil")
def actualizar_perfil_usuario(payload: dict, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    """Actualizar perfil del usuario"""
    campos_permitidos = ["nombre", "correo"]
    
    for campo, valor in payload.items():
        if campo in campos_permitidos:
            if campo == "correo":
                # Verificar que el nuevo correo no esté en uso
                existente = db.query(Usuario).filter(Usuario.correo == valor, Usuario.id != usuario.id).first()
                if existente:
                    raise HTTPException(status_code=400, detail="Correo ya en uso")
            setattr(usuario, campo, valor)
    
    db.commit()
    db.refresh(usuario)
    
    return {"mensaje": "Perfil actualizado exitosamente"}

@router.put("/usuarios/cambiar-contrasena")
def cambiar_contrasena(payload: dict, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    """Cambiar contraseña del usuario"""
    contrasena_actual = payload.get("contrasena_actual")
    nueva_contrasena = payload.get("nueva_contrasena")
    
    if not contrasena_actual or not nueva_contrasena:
        raise HTTPException(status_code=400, detail="Se requieren ambas contraseñas")
    
    # Verificar contraseña actual
    if not bcrypt.verify(contrasena_actual, usuario.contrasena):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
    
    # Actualizar contraseña
    usuario.contrasena = bcrypt.hash(nueva_contrasena)
    db.commit()
    
    return {"mensaje": "Contraseña cambiada exitosamente"}

@router.delete("/usuarios/cuenta")
def eliminar_cuenta(contrasena: str, db: Session = Depends(get_db), usuario = Depends(obtener_usuario_actual)):
    """Eliminar cuenta del usuario"""
    # Verificar contraseña
    if not bcrypt.verify(contrasena, usuario.contrasena):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")
    
    # Eliminar usuario
    db.delete(usuario)
    db.commit()
    
    return {"mensaje": "Cuenta eliminada exitosamente"}

@router.get("/usuarios/estadisticas")
def obtener_estadisticas_usuario(usuario = Depends(obtener_usuario_actual)):
    """Obtener estadísticas básicas del usuario"""
    return {
        "usuario_id": usuario.id,
        "fecha_registro": usuario.fecha_registro.isoformat() if usuario.fecha_registro else None,
        "ultimo_acceso": usuario.ultimo_acceso.isoformat() if usuario.ultimo_acceso else None,
        "rol": usuario.rol
    }