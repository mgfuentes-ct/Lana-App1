#!/usr/bin/env python3
"""
Configuración para el servicio de correo electrónico
"""
import os
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración del servidor de correo
EMAIL_CONFIG = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "tu_correo@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "tu_contraseña_app"),
    MAIL_FROM=os.getenv("MAIL_FROM", "tu_correo@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "Lana App"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS", "True").lower() == "true",
    VALIDATE_CERTS=os.getenv("VALIDATE_CERTS", "True").lower() == "true"
)

# Configuración adicional
EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", "False").lower() == "true"
