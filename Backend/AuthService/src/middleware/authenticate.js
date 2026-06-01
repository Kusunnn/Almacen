import { verifyAuthToken } from "../auth/jwt.js";

export function authenticate(req, _res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    const error = new Error("Token de autenticación requerido");
    error.status = 401;
    return next(error);
  }

  try {
    req.auth = verifyAuthToken(token);
    return next();
  } catch {
    const error = new Error("Token de autenticación inválido o expirado");
    error.status = 401;
    return next(error);
  }
}
