#!/usr/bin/env python3
"""
Servicio de correo electrónico para la aplicación
"""
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import Optional
import os
from datetime import datetime

# Importar configuración
from config.email_config import EMAIL_CONFIG, EMAIL_ENABLED

class EmailService:
    def __init__(self):
        self.fastmail = FastMail(EMAIL_CONFIG)
    
    async def enviar_correo_cambio_contrasena(self, email: str, nombre_usuario: str, fecha_cambio: datetime):
        """
        Enviar correo de notificación de cambio de contraseña
        """
        try:
            # Crear el contenido del correo
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Cambio de Contraseña - Lana App</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background-color: #3498db;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }}
                    .content {{
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 0 0 5px 5px;
                    }}
                    .alert {{
                        background-color: #fff3cd;
                        border: 1px solid #ffeaa7;
                        color: #856404;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                        font-size: 12px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🔐 Cambio de Contraseña</h1>
                    <p>Lana App - Gestión Financiera</p>
                </div>
                
                <div class="content">
                    <h2>Hola {nombre_usuario},</h2>
                    
                    <p>Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
                    
                    <div class="alert">
                        <strong>⚠️ Importante:</strong> Si no realizaste este cambio, 
                        contacta inmediatamente con soporte técnico.
                    </div>
                    
                    <h3>Detalles del cambio:</h3>
                    <ul>
                        <li><strong>Usuario:</strong> {nombre_usuario}</li>
                        <li><strong>Correo:</strong> {email}</li>
                        <li><strong>Fecha y hora:</strong> {fecha_cambio.strftime('%d/%m/%Y %H:%M:%S')}</li>
                    </ul>
                    
                    <p>Si realizaste este cambio, puedes ignorar este correo.</p>
                    
                    <p>Para mayor seguridad, te recomendamos:</p>
                    <ul>
                        <li>Usar contraseñas únicas y seguras</li>
                        <li>No compartir tus credenciales</li>
                        <li>Activar la autenticación de dos factores si está disponible</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    <p>© 2025 Lana App. Todos los derechos reservados.</p>
                </div>
            </body>
            </html>
            """
            
            # Crear el mensaje
            message = MessageSchema(
                subject="🔐 Cambio de Contraseña - Lana App",
                recipients=[email],
                body=html_content,
                subtype="html"
            )
            
            # Enviar el correo
            await self.fastmail.send_message(message)
            print(f"✅ Correo de cambio de contraseña enviado a {email}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando correo a {email}: {str(e)}")
            return False
    
    async def enviar_correo_bienvenida(self, email: str, nombre_usuario: str):
        """
        Enviar correo de bienvenida a nuevos usuarios
        """
        try:
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>¡Bienvenido a Lana App!</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background-color: #27ae60;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }}
                    .content {{
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 0 0 5px 5px;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                        font-size: 12px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎉 ¡Bienvenido a Lana App!</h1>
                    <p>Tu aplicación de gestión financiera personal</p>
                </div>
                
                <div class="content">
                    <h2>Hola {nombre_usuario},</h2>
                    
                    <p>¡Gracias por registrarte en Lana App! Estamos emocionados de ayudarte a 
                    gestionar tus finanzas de manera más eficiente.</p>
                    
                    <h3>¿Qué puedes hacer con Lana App?</h3>
                    <ul>
                        <li>📊 Registrar ingresos y egresos</li>
                        <li>📈 Crear presupuestos personalizados</li>
                        <li>📋 Categorizar tus transacciones</li>
                        <li>🔔 Recibir notificaciones de pagos</li>
                        <li>📱 Acceder desde cualquier dispositivo</li>
                    </ul>
                    
                    <p>¡Comienza ahora mismo a organizar tus finanzas!</p>
                </div>
                
                <div class="footer">
                    <p>© 2025 Lana App. Todos los derechos reservados.</p>
                </div>
            </body>
            </html>
            """
            
            message = MessageSchema(
                subject="🎉 ¡Bienvenido a Lana App!",
                recipients=[email],
                body=html_content,
                subtype="html"
            )
            
            await self.fastmail.send_message(message)
            print(f"✅ Correo de bienvenida enviado a {email}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando correo de bienvenida a {email}: {str(e)}")
            return False

# Instancia global del servicio de correo
email_service = EmailService()
