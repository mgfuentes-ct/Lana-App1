# Configuración de la API para Lana App

## Descripción
Esta aplicación está configurada para conectarse con una API backend desarrollada en FastAPI. La pantalla de login ya está completamente conectada y funcional.

## Archivos de Configuración

### 1. Configuración de la API
- **Archivo**: `src/config/apiConfig.js`
- **Función**: Centraliza toda la configuración de la API
- **Configuración**: URLs, timeouts, endpoints y headers

### 2. Servicio de Autenticación
- **Archivo**: `src/services/authService.js`
- **Función**: Maneja todas las operaciones de autenticación
- **Características**: Login, logout, verificación de estado, manejo de errores

### 3. Configuración de Axios
- **Archivo**: `src/utils/api.js`
- **Función**: Configuración base de Axios con interceptores
- **Características**: Manejo automático de tokens, manejo de errores 401

### 4. Hook de Autenticación
- **Archivo**: `src/hooks/useAuth.js`
- **Función**: Estado global de autenticación
- **Características**: Context API, persistencia de datos, sincronización

## Configuración del Entorno

### Desarrollo Local
```javascript
// En src/config/apiConfig.js
if (__DEV__) {
  return 'http://127.0.0.1:8000';
}
```

### Dispositivo Físico
Si estás probando en un dispositivo físico, cambia la IP por tu IP local:

```javascript
// En src/config/apiConfig.js
if (__DEV__) {
  // Cambia por tu IP local
  return 'http://192.168.1.100:8000';
}
```

### Producción
```javascript
// En src/config/apiConfig.js
return 'https://tu-api-produccion.com';
```

## Endpoints de la API

La aplicación espera que tu backend tenga estos endpoints:

- **POST** `/auth/login` - Inicio de sesión
- **POST** `/auth/register` - Registro de usuario
- **POST** `/auth/logout` - Cierre de sesión
- **POST** `/auth/refresh` - Renovación de token
- **POST** `/auth/forgot-password` - Recuperar contraseña
- **POST** `/auth/reset-password` - Restablecer contraseña

## Formato de Respuesta Esperado

### Login Exitoso
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "usuario": {
    "id": 1,
    "correo": "usuario@ejemplo.com",
    "nombre": "Usuario Ejemplo",
    "rol": "usuario"
  }
}
```

### Error de Autenticación
```json
{
  "detail": "Correo o contraseña incorrectos"
}
```

## Características Implementadas

### ✅ Pantalla de Login
- Validación de formulario en tiempo real
- Manejo de estados de carga
- Manejo de errores de la API
- Persistencia de tokens
- Navegación automática después del login

### ✅ Seguridad
- Tokens JWT almacenados en AsyncStorage
- Interceptores automáticos para headers de autorización
- Manejo automático de tokens expirados
- Limpieza automática de datos al logout

### ✅ Experiencia de Usuario
- Indicadores de carga
- Mensajes de error claros
- Validación de campos
- Manejo del teclado
- Scroll automático

## Instalación de Dependencias

Las dependencias necesarias ya están instaladas:

```bash
npm install @react-native-async-storage/async-storage axios
```

## Uso del Hook de Autenticación

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Tu lógica aquí
};
```

## Solución de Problemas

### Error de Conexión
1. Verifica que tu backend esté ejecutándose
2. Confirma la URL en `apiConfig.js`
3. Verifica que no haya firewall bloqueando la conexión

### Error de CORS (si usas web)
Asegúrate de que tu backend permita requests desde tu dominio de desarrollo.

### Token No Se Guarda
Verifica que `@react-native-async-storage/async-storage` esté correctamente instalado.

## Próximos Pasos

1. **Registro de Usuario**: Implementar la pantalla de registro
2. **Recuperación de Contraseña**: Conectar con el endpoint correspondiente
3. **Perfil de Usuario**: Mostrar información del usuario logueado
4. **Logout**: Implementar cierre de sesión en todas las pantallas

## Notas Importantes

- La aplicación maneja automáticamente la renovación de tokens
- Los datos del usuario se almacenan localmente para mejor rendimiento
- La autenticación se verifica automáticamente al iniciar la app
- Todos los errores de red y del servidor están manejados apropiadamente
