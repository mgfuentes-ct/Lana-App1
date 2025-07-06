from sqlalchemy import Column, Integer, String, Boolean, Text, Date, DateTime, DECIMAL, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(255), nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

class CuentaBancaria(Base):
    __tablename__ = 'cuentas_bancarias'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    nombre_banco = Column(String(100))
    numero_cuenta = Column(String(50))
    tipo_cuenta = Column(String(50))

class Categoria(Base):
    __tablename__ = 'categorias'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    tipo = Column(Enum('ingreso', 'egreso'))

class Transaccion(Base):
    __tablename__ = 'transacciones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    cuenta_id = Column(Integer, ForeignKey('cuentas_bancarias.id'))
    categoria_id = Column(Integer, ForeignKey('categorias.id'))
    monto = Column(DECIMAL(10,2))
    tipo = Column(Enum('ingreso', 'egreso'), nullable=False)
    descripcion = Column(Text)
    fecha = Column(Date)

class PagoFijo(Base):
    __tablename__ = 'pagos_fijos'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    nombre = Column(String(100))
    monto = Column(DECIMAL(10,2))
    categoria = Column(String(100))
    frecuencia = Column(String(50))
    fecha_inicio = Column(Date)
    estado = Column(Enum('Pendiente', 'Completado'), default='Pendiente')
    activo = Column(Boolean, default=True)

class ConfiguracionNotificacion(Base):
    __tablename__ = 'configuracion_notificaciones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    email = Column(Boolean, default=True)
    sms = Column(Boolean, default=False)
    recordatorios = Column(Boolean, default=True)

class Notificacion(Base):
    __tablename__ = 'notificaciones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    mensaje = Column(Text)
    leido = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

class Soporte(Base):
    __tablename__ = 'soporte'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    asunto = Column(String(100))
    mensaje = Column(Text)
    fecha_envio = Column(DateTime, default=datetime.utcnow)

class Recuperacion(Base):
    __tablename__ = 'recuperaciones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    token = Column(String(255))
    expiracion = Column(DateTime)
    usado = Column(Boolean, default=False)

class Sesion(Base):
    __tablename__ = 'sesiones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    token = Column(String(255))
    creado_en = Column(DateTime, default=datetime.utcnow)
    valido = Column(Boolean, default=True)


