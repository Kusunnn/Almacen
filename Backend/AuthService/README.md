# AuthService

Microservicio de autenticacion inicial para el proyecto Almacen.

Por ahora comparte la misma base de datos de Supabase que el backend principal y reutiliza las tablas `usuarios` y `roles`.

## Rutas

- `GET /api/auth/roles`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/auth/users`
- `GET /api/auth/users/:id`
- `POST /api/auth/users`
- `PUT /api/auth/users/:id`
- `DELETE /api/auth/users/:id`

## Desarrollo

Desde esta carpeta:

```bash
npm install
npm run dev
```

Por defecto corre en el puerto `3001`. Puedes cambiarlo con `AUTH_PORT`.

## JWT

`POST /api/auth/login` devuelve el usuario autenticado y un token:

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

El token se debe enviar en rutas protegidas con:

```http
Authorization: Bearer jwt...
```

Variables recomendadas:

```env
JWT_SECRET=una_clave_larga_y_privada
JWT_EXPIRES_IN=8h
```
