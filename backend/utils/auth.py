from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from models.BD import Usuario
from utils.jwt import verificar_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verificar_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    usuario = db.query(Usuario).filter(Usuario.id == int(payload.get("sub"))).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

async def get_token_actual(request: Request) -> str:
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token no encontrado")
    return token