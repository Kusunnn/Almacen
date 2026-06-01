# Pendientes de integracion de AuthService

Este documento describe lo que falta para que `Backend/AuthService` quede integrado como microservicio de autenticacion separado del backend principal.

## Estado actual

Ya existe un AuthService independiente en `Backend/AuthService`.

Rutas actuales:

```txt
GET    /api/auth/roles
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
GET    /api/auth/users
GET    /api/auth/users/:id
POST   /api/auth/users
PUT    /api/auth/users/:id
DELETE /api/auth/users/:id
```

El login ya devuelve JWT:

```json
{
  "mensaje": "Login exitoso",
  "token": "jwt...",
  "usuario": {
    "id": 1,
    "nombre": "Usuario",
    "correo": "usuario@example.com"
  }
}
```

La ruta `GET /api/auth/me` requiere:

```http
Authorization: Bearer jwt...
```

## Bloqueo actual: conexion a base de datos

Antes de integrar frontend o limpiar el backend principal, hay que corregir la conexion a Supabase.

Comando de prueba desde `Backend`:

```bash
npm run test:db
```

El error visto fue:

```txt
tenant/user ... not found
```

Ese error tambien ocurre en el backend principal, por lo que no parece venir del AuthService. Probablemente se necesita pedir a quien tenga acceso a Supabase las variables actualizadas:

```env
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=8h
AUTH_PORT=3001
```

`JWT_SECRET` debe ser una clave larga y privada. No debe depender del valor fallback de desarrollo.

## Frontend: cambios necesarios

El frontend debe dejar de usar el endpoint antiguo:

```txt
POST http://localhost:3000/api/usuarios/login
```

y usar:

```txt
POST http://localhost:3001/api/auth/login
```

### Archivos principales a tocar

```txt
Frontend/src/app/services/api.config.ts
Frontend/src/app/services/auth.service.ts
Frontend/src/app/models/auth.model.ts
Frontend/src/app/guards/auth.guard.ts
Frontend/src/app/services/users.service.ts
Frontend/src/app/pages/login/login.ts
Frontend/src/app/pages/register/register.ts
```

### Configuracion de URLs

En `api.config.ts` conviene separar backend principal y AuthService:

```ts
export const API_BASE_URL = 'http://localhost:3000/api';
export const AUTH_API_BASE_URL = 'http://localhost:3001/api';
```

### Modelo de login

`LoginResponse` debe incluir `token`:

```ts
export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: AuthUser;
}
```

### AuthService del frontend

El `AuthService` debe:

- llamar `POST ${AUTH_API_BASE_URL}/auth/login`
- guardar `token` en `localStorage`
- guardar `usuario` en `localStorage`
- limpiar ambos en logout
- opcionalmente llamar `GET /api/auth/me` al iniciar la app para validar sesion

Ejemplo conceptual:

```ts
localStorage.setItem('almacen.token', response.token);
localStorage.setItem('almacen.currentUser', JSON.stringify(response.usuario));
```

### Enviar token

Lo mas limpio es agregar un interceptor HTTP que mande:

```http
Authorization: Bearer TOKEN
```

Para empezar, si no se quiere hacer interceptor todavia, se puede enviar manualmente en los servicios que lo necesiten. El interceptor es mejor porque evita repetir codigo.

### Register y usuarios

El registro debe dejar de llamar:

```txt
POST http://localhost:3000/api/usuarios
```

y llamar:

```txt
POST http://localhost:3001/api/auth/register
```

Las consultas de roles deben cambiar de:

```txt
GET http://localhost:3000/api/usuarios/roles
```

a:

```txt
GET http://localhost:3001/api/auth/roles
```

El perfil por usuario debe cambiar de:

```txt
GET http://localhost:3000/api/usuarios/:id
```

a:

```txt
GET http://localhost:3001/api/auth/users/:id
```

## Backend principal: JWT

El backend principal debe validar tokens emitidos por AuthService para proteger rutas privadas.

### Dependencia

En `Backend`:

```bash
npm install jsonwebtoken
```

### Middleware sugerido

Crear:

```txt
Backend/src/middleware/authenticate.js
```

Responsabilidades:

- leer `Authorization`
- exigir formato `Bearer TOKEN`
- validar con `JWT_SECRET`
- guardar el payload en `req.auth`
- responder `401` si el token falta, es invalido o expiro

### Rutas a proteger

En `Backend/src/server.js`, proteger rutas de dominio:

```js
app.use("/api/almacenes", authenticate, almacenesRouter);
app.use("/api/herramientas", authenticate, herramientasRouter);
app.use("/api/historial", authenticate, historialRouter);
app.use("/api/marcas", authenticate, marcasRouter);
app.use("/api/prestamos", authenticate, prestamosRouter);
app.use("/api/roles", authenticate, rolesRouter);
app.use("/api/tipos-herramienta", authenticate, tiposHerramientaRouter);
```

Durante la transicion se puede proteger menos rutas para probar por etapas.

### Uso del usuario autenticado

El payload del token contiene:

```js
req.auth.sub       // id del usuario
req.auth.correo
req.auth.idRol
req.auth.rolNombre
```

Con eso se puede:

- saber quien hizo una accion
- restringir operaciones por rol
- evitar que el frontend mande `id_usuario` en acciones donde debe usarse el usuario autenticado

## Backend principal: que borrar o mover de Usuarios

Cuando el frontend ya use AuthService y todo este probado, se puede limpiar el backend principal.

### Quitar del server principal

En `Backend/src/server.js`, eliminar:

```js
import usuariosRouter from "./modules/Usuarios/usuarios.routes.js";
app.use("/api/usuarios", usuariosRouter);
```

### Borrar o dejar archivado

Se podrian borrar estos archivos del backend principal:

```txt
Backend/src/modules/Usuarios/usuarios.routes.js
Backend/src/modules/Usuarios/usuarios.controller.js
Backend/src/modules/Usuarios/usuarios.service.js
Backend/src/modules/Usuarios/usuarios.repository.js
Backend/src/modules/Usuarios/usuarios.dto.js
Backend/src/modules/Usuarios/usuarios.mapper.js
```

Recomendacion: no borrarlos hasta que el frontend ya use AuthService y las pruebas de login/register/perfil pasen.

### Cuidado con relaciones internas

Aunque se quite el modulo `Usuarios`, el backend principal todavia puede necesitar el modelo `usuarios` en Prisma porque:

- `prestamos` tiene relacion con `usuarios`
- `historial` tiene relacion con `usuarios`
- algunos repositorios validan que `id_usuario` exista

Por eso no se debe borrar inmediatamente el modelo `usuarios` de `Backend/prisma/schema.prisma`.

Si se quiere una separacion mas estricta despues, se puede reemplazar validaciones directas a Prisma por llamadas HTTP al AuthService. Para esta etapa, como comparten BD, se puede dejar igual.

## AuthService: pendientes propios

### Variables de entorno

Agregar y documentar:

```env
AUTH_PORT=3001
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=8h
```

### Validar login real

Cuando la BD funcione:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario@example.com","contrasena":"123456"}'
```

Debe responder con `token` y `usuario`.

### Validar `/me`

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

Debe responder:

```json
{
  "usuario": {
    "id": 1,
    "nombre": "Usuario"
  }
}
```

### Validar errores

Casos esperados:

- login con contrasena incorrecta: `401`
- `/me` sin token: `401`
- `/me` con token invalido: `401`
- registro con correo duplicado: `409`
- registro con rol inexistente: `400`

### Scripts opcionales en backend principal

Para correr AuthService desde `Backend`, se pueden agregar scripts:

```json
{
  "auth:dev": "npm --prefix AuthService run dev",
  "auth:start": "npm --prefix AuthService run start"
}
```

### Seguridad pendiente

- No usar el fallback de `JWT_SECRET` en entornos reales.
- Definir expiracion razonable, por ejemplo `8h`.
- Considerar refresh token si se necesita mantener sesiones largas.
- Revisar CORS si el frontend corre en otro puerto/dominio.
- Evitar devolver datos sensibles del usuario. Actualmente `toUsuarioDto` no devuelve `contrasena`.

## Orden recomendado para terminar

1. Corregir conexion a Supabase.
2. Probar `AuthService` con login/register/roles/users/me.
3. Cambiar frontend para usar AuthService.
4. Guardar token en frontend.
5. Enviar token desde frontend.
6. Agregar middleware JWT al backend principal.
7. Proteger rutas del backend principal.
8. Probar flujo completo: login -> token -> crear/listar prestamos/herramientas.
9. Quitar rutas `/api/usuarios` del backend principal.
10. Borrar modulo viejo `Backend/src/modules/Usuarios` solo cuando todo este estable.
