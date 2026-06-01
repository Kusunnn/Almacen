import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAuthToken(usuario) {
  return jwt.sign(
    {
      correo: usuario.correo,
      idRol: usuario.id_rol ?? usuario.idRol ?? null,
      rolNombre: usuario.roles?.nombre ?? usuario.rolNombre ?? null,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
      subject: String(usuario.id),
    }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
