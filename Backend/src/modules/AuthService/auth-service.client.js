import { env } from "../../config/env.js";

function authServiceError(message, status = 502) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function existsUsuario(id) {
  const url = `${env.authServiceUrl}/users/${encodeURIComponent(id)}`;

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw authServiceError("No se pudo validar el usuario en AuthService");
  }

  if (response.status === 404) return false;
  if (!response.ok) {
    throw authServiceError("AuthService no pudo validar el usuario");
  }

  return true;
}
