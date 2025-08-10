from sqlalchemy import Column, Integer, String, Boolean, Text, Date, DateTime, DECIMAL, Enum, ForeignKey, Index
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
    rol = Column(Enum('usuario', 'admin', name='rol_usuario'), default='usuario', nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    # Relationships
    presupuestos = relationship("Presupuesto", back_populates="usuario")
    transacciones = relationship("Transaccion", back_populates="usuario")

class Presupuesto(Base):
    __tablename__ = 'presupuestos'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    categoria_id = Column(Integer, ForeignKey('categorias.id'), nullable=False)
    nombre = Column(String(100), nullable=False)
    monto_total = Column(DECIMAL(10,2), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)

    usuario = relationship("Usuario", back_populates="presupuestos")
    categoria = relationship("Categoria")

class AlertaPresupuesto(Base):
    __tablename__ = 'alertas_presupuesto'
    id = Column(Integer, primary_key=True)
    presupuesto_id = Column(Integer, ForeignKey('presupuestos.id'), nullable=False)
    fecha_alerta = Column(DateTime, default=datetime.utcnow)
    mensaje = Column(Text, nullable=False)
    leido = Column(Boolean, default=False)

    presupuesto = relationship("Presupuesto")

class Categoria(Base):
    __tablename__ = 'categorias'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    tipo = Column(Enum('ingreso', 'egreso'))

class Transaccion(Base):
    __tablename__ = 'transacciones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    presupuesto_id = Column(Integer, ForeignKey('presupuestos.id'), nullable=True)    
    categoria_id = Column(Integer, ForeignKey('categorias.id'), nullable=False)
    monto = Column(DECIMAL(10,2), nullable=False)
    tipo = Column(Enum('ingreso', 'egreso', name='tipo_transaccion'), nullable=False)
    descripcion = Column(Text)
    fecha = Column(Date, default=datetime.utcnow)
    activo = Column(Boolean, default=True)

    usuario = relationship("Usuario", back_populates="transacciones")
    presupuesto = relationship("Presupuesto")
    categoria = relationship("Categoria")

class PagoFijo(Base):
    __tablename__ = 'pagos_fijos'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    nombre = Column(String(100))
    monto = Column(DECIMAL(10,2))
    categoria = Column(String(100))
    frecuencia = Column(Enum('diario', 'semanal', 'quincenal', 'mensual', 'anual', name='frecuencia_pago'), nullable=False)
    fecha_inicio = Column(Date)
    estado = Column(Enum('Pendiente', 'Completado', name='estado_pago'), default='Pendiente')
    activo = Column(Boolean, default=True)

class ConfiguracionNotificacion(Base):
    __tablename__ = 'configuracion_notificaciones'
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
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

Index('idx_usuario_id_transaccion', Transaccion.usuario_id)
Index('idx_fecha_transaccion', Transaccion.fecha)