from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text, Enum, DECIMAL, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List
import enum
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://root:Limones4k@localhost:3306/lana_app")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(
    title="Lana App API",
    description="API para control de finanzas personales",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ENUMS
class TipoCategoriaEnum(str, enum.Enum):
    ingreso = "ingreso"
    egreso = "egreso"

class TipoTransaccionEnum(str, enum.Enum):
    ingreso = "ingreso"
    egreso = "egreso"

# MODELOS SQLALCHEMY
class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    foto_perfil = Column(Text)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

class Categoria(Base):
    __tablename__ = "categorias"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    tipo = Column(Enum(TipoCategoriaEnum))

class CuentaBancaria(Base):
    __tablename__ = "cuentas_bancarias"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    nombre_banco = Column(String(100))
    numero_cuenta = Column(String(50))
    tipo_cuenta = Column(String(50))

class Transaccion(Base):
    __tablename__ = "transacciones"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    cuenta_id = Column(Integer, ForeignKey("cuentas_bancarias.id"))
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    monto = Column(DECIMAL(10,2))
    tipo = Column(Enum(TipoTransaccionEnum))
    descripcion = Column(Text)
    fecha = Column(DateTime)
    estado_id = Column(Integer)

class ConfiguracionNotificaciones(Base):
    __tablename__ = "configuracion_notificaciones"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    email = Column(Boolean, default=True)
    sms = Column(Boolean, default=False)
    recordatorios = Column(Boolean, default=True)

# MODELOS Pydantic
class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    correo: str
    foto_perfil: Optional[str]
    fecha_registro: datetime
    class Config:
        orm_mode = True

class UsuarioCreate(BaseModel):
    nombre: str
    correo: str
    contrasena: str
    foto_perfil: Optional[str] = None

class CategoriaResponse(BaseModel):
    id: int
    nombre: str
    tipo: TipoCategoriaEnum
    class Config:
        orm_mode = True

class CategoriaCreate(BaseModel):
    nombre: str
    tipo: TipoCategoriaEnum

class CuentaBancariaResponse(BaseModel):
    id: int
    usuario_id: int
    nombre_banco: Optional[str]
    numero_cuenta: Optional[str]
    tipo_cuenta: Optional[str]
    class Config:
        orm_mode = True

class CuentaBancariaCreate(BaseModel):
    usuario_id: int
    nombre_banco: Optional[str]
    numero_cuenta: Optional[str]
    tipo_cuenta: Optional[str]

class TransaccionResponse(BaseModel):
    id: int
    usuario_id: int
    cuenta_id: Optional[int]
    categoria_id: Optional[int]
    monto: float
    tipo: TipoTransaccionEnum
    descripcion: Optional[str]
    fecha: Optional[datetime]
    estado_id: int
    class Config:
        orm_mode = True

class TransaccionCreate(BaseModel):
    usuario_id: int
    cuenta_id: Optional[int]
    categoria_id: Optional[int]
    monto: float
    tipo: TipoTransaccionEnum
    descripcion: Optional[str]
    fecha: Optional[datetime]
    estado_id: int

class ConfiguracionNotificacionesResponse(BaseModel):
    id: int
    usuario_id: int
    email: bool
    sms: bool
    recordatorios: bool
    class Config:
        orm_mode = True

class ConfiguracionNotificacionesCreate(BaseModel):
    usuario_id: int
    email: bool = True
    sms: bool = False
    recordatorios: bool = True

# DEPENDENCIA DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# SECURITY
SECRET_KEY = os.getenv("SECRET_KEY", "lana_app_secret_key_2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.correo == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.contrasena):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/token", response_model=Token, tags=["Auth"])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# Ejemplo de endpoint protegido:
@app.get("/usuarios/me", response_model=UsuarioResponse, tags=["Usuarios"])
def leer_usuario_actual(current_user: Usuario = Depends(get_current_user)):
    return current_user

# ENDPOINTS USUARIOS
@app.get("/usuarios/", response_model=List[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@app.post("/usuarios/", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    db_user = Usuario(**usuario.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/usuarios/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(usuario_id: int, usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for k, v in usuario.dict().items():
        setattr(db_user, k, v)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(db_user)
    db.commit()
    return {"mensaje": "Usuario eliminado"}

# ENDPOINTS CATEGORIAS
@app.get("/categorias/", response_model=List[CategoriaResponse])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).all()

@app.post("/categorias/", response_model=CategoriaResponse)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    db_categoria = Categoria(**categoria.dict())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@app.put("/categorias/{categoria_id}", response_model=CategoriaResponse)
def actualizar_categoria(categoria_id: int, categoria: CategoriaCreate, db: Session = Depends(get_db)):
    db_categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    for k, v in categoria.dict().items():
        setattr(db_categoria, k, v)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@app.delete("/categorias/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    db_categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(db_categoria)
    db.commit()
    return {"mensaje": "Categoría eliminada"}

# ENDPOINTS CUENTAS BANCARIAS
@app.get("/cuentas_bancarias/", response_model=List[CuentaBancariaResponse])
def listar_cuentas(db: Session = Depends(get_db)):
    return db.query(CuentaBancaria).all()

@app.post("/cuentas_bancarias/", response_model=CuentaBancariaResponse)
def crear_cuenta(cuenta: CuentaBancariaCreate, db: Session = Depends(get_db)):
    db_cuenta = CuentaBancaria(**cuenta.dict())
    db.add(db_cuenta)
    db.commit()
    db.refresh(db_cuenta)
    return db_cuenta

@app.put("/cuentas_bancarias/{cuenta_id}", response_model=CuentaBancariaResponse)
def actualizar_cuenta(cuenta_id: int, cuenta: CuentaBancariaCreate, db: Session = Depends(get_db)):
    db_cuenta = db.query(CuentaBancaria).filter(CuentaBancaria.id == cuenta_id).first()
    if not db_cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    for k, v in cuenta.dict().items():
        setattr(db_cuenta, k, v)
    db.commit()
    db.refresh(db_cuenta)
    return db_cuenta

@app.delete("/cuentas_bancarias/{cuenta_id}")
def eliminar_cuenta(cuenta_id: int, db: Session = Depends(get_db)):
    db_cuenta = db.query(CuentaBancaria).filter(CuentaBancaria.id == cuenta_id).first()
    if not db_cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    db.delete(db_cuenta)
    db.commit()
    return {"mensaje": "Cuenta eliminada"}

# ENDPOINTS TRANSACCIONES
@app.get("/transacciones/", response_model=List[TransaccionResponse])
def listar_transacciones(db: Session = Depends(get_db)):
    return db.query(Transaccion).all()

@app.post("/transacciones/", response_model=TransaccionResponse)
def crear_transaccion(transaccion: TransaccionCreate, db: Session = Depends(get_db)):
    db_transaccion = Transaccion(**transaccion.dict())
    db.add(db_transaccion)
    db.commit()
    db.refresh(db_transaccion)
    return db_transaccion

@app.put("/transacciones/{transaccion_id}", response_model=TransaccionResponse)
def actualizar_transaccion(transaccion_id: int, transaccion: TransaccionCreate, db: Session = Depends(get_db)):
    db_transaccion = db.query(Transaccion).filter(Transaccion.id == transaccion_id).first()
    if not db_transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    for k, v in transaccion.dict().items():
        setattr(db_transaccion, k, v)
    db.commit()
    db.refresh(db_transaccion)
    return db_transaccion

@app.delete("/transacciones/{transaccion_id}")
def eliminar_transaccion(transaccion_id: int, db: Session = Depends(get_db)):
    db_transaccion = db.query(Transaccion).filter(Transaccion.id == transaccion_id).first()
    if not db_transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    db.delete(db_transaccion)
    db.commit()
    return {"mensaje": "Transacción eliminada"}

# ENDPOINTS CONFIGURACION NOTIFICACIONES
@app.get("/configuracion_notificaciones/", response_model=List[ConfiguracionNotificacionesResponse])
def listar_config_notificaciones(db: Session = Depends(get_db)):
    return db.query(ConfiguracionNotificaciones).all()

@app.post("/configuracion_notificaciones/", response_model=ConfiguracionNotificacionesResponse)
def crear_config_notificaciones(config: ConfiguracionNotificacionesCreate, db: Session = Depends(get_db)):
    db_config = ConfiguracionNotificaciones(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@app.put("/configuracion_notificaciones/{config_id}", response_model=ConfiguracionNotificacionesResponse)
def actualizar_config_notificaciones(config_id: int, config: ConfiguracionNotificacionesCreate, db: Session = Depends(get_db)):
    db_config = db.query(ConfiguracionNotificaciones).filter(ConfiguracionNotificaciones.id == config_id).first()
    if not db_config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    for k, v in config.dict().items():
        setattr(db_config, k, v)
    db.commit()
    db.refresh(db_config)
    return db_config

@app.delete("/configuracion_notificaciones/{config_id}")
def eliminar_config_notificaciones(config_id: int, db: Session = Depends(get_db)):
    db_config = db.query(ConfiguracionNotificaciones).filter(ConfiguracionNotificaciones.id == config_id).first()
    if not db_config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    db.delete(db_config)
    db.commit()
    return {"mensaje": "Configuración eliminada"}
