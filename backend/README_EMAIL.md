# 📧 Configuración del Servicio de Correo Electrónico

## Descripción

El servicio de correo electrónico permite enviar notificaciones automáticas cuando los usuarios cambian su contraseña. Esto mejora la seguridad al notificar al usuario sobre cambios en su cuenta.

## Funcionalidades

- ✅ **Notificación de cambio de contraseña**: Envía un correo cuando el usuario cambia su contraseña
- ✅ **Correo de bienvenida**: Envía un correo de bienvenida a nuevos usuarios (preparado)
- ✅ **Plantillas HTML**: Correos con diseño profesional y responsive
- ✅ **Manejo de errores**: No falla la operación si el correo no se puede enviar

## Configuración

### 1. Configurar Gmail (Recomendado)

#### Paso 1: Activar verificación en dos pasos
1. Ve a tu [cuenta de Google](https://myaccount.google.com/)
2. Ve a "Seguridad"
3. Activa "Verificación en 2 pasos"

#### Paso 2: Generar contraseña de aplicación
1. Ve a "Contraseñas de aplicación"
2. Selecciona "Otra" y nombra "Lana App"
3. Copia la contraseña generada (16 caracteres)

#### Paso 3: Configurar variables de entorno
1. Copia el archivo `email_config.env` a `.env`
2. Edita el archivo `.env` con tus credenciales:

```env
# Habilitar envío de correos
EMAIL_ENABLED=True

# Configuración SMTP para Gmail
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion_16_caracteres
MAIL_FROM=tu_correo@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Lana App
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
USE_CREDENTIALS=True
VALIDATE_CERTS=True
```

### 2. Probar la configuración

```bash
python test_email.py
```

Si ves "✅ Correo de cambio de contraseña enviado exitosamente", la configuración es correcta.

## Uso

### Cambio de Contraseña

Cuando un usuario cambia su contraseña a través del endpoint `/usuarios/cambiar-contrasena`, automáticamente se envía un correo con:

- ✅ Confirmación del cambio
- ✅ Detalles del usuario
- ✅ Fecha y hora del cambio
- ✅ Recomendaciones de seguridad
- ✅ Advertencia si no fue el usuario

### Estructura del Correo

```
🔐 Cambio de Contraseña - Lana App
├── Header con logo y título
├── Saludo personalizado
├── Confirmación del cambio
├── ⚠️ Advertencia de seguridad
├── Detalles del cambio
│   ├── Usuario
│   ├── Correo
│   └── Fecha y hora
├── Recomendaciones de seguridad
└── Footer con información legal
```

## Seguridad

- 🔒 **Contraseñas de aplicación**: No usa la contraseña principal de Gmail
- 🔒 **Verificación en 2 pasos**: Requerida para generar contraseñas de aplicación
- 🔒 **TLS/SSL**: Conexión encriptada con el servidor SMTP
- 🔒 **Validación de certificados**: Verifica la identidad del servidor

## Troubleshooting

### Error: "Username and Password not accepted"

**Solución:**
1. Verifica que la verificación en 2 pasos esté activada
2. Genera una nueva contraseña de aplicación
3. Asegúrate de usar la contraseña de aplicación, no tu contraseña normal

### Error: "Connection refused"

**Solución:**
1. Verifica que el puerto 587 esté abierto
2. Asegúrate de que `MAIL_STARTTLS=True`
3. Verifica la configuración del firewall

### Error: "Authentication failed"

**Solución:**
1. Verifica que `MAIL_USERNAME` y `MAIL_PASSWORD` sean correctos
2. Asegúrate de usar una contraseña de aplicación válida
3. Verifica que la cuenta no tenga restricciones de seguridad

## Archivos del Servicio

- `utils/email_service.py` - Servicio principal de correo
- `config/email_config.py` - Configuración del servidor
- `routes/usuarios.py` - Endpoint que usa el servicio
- `test_email.py` - Script de prueba
- `email_config.env` - Plantilla de configuración

## Notas Importantes

- ⚠️ **No compartas** las credenciales de correo
- ⚠️ **No subas** el archivo `.env` al repositorio
- ⚠️ **Usa siempre** contraseñas de aplicación para Gmail
- ⚠️ **Prueba** la configuración antes de usar en producción
