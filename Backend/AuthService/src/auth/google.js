import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

const client = new OAuth2Client(env.googleClientId);

/**
 * Verifica un id_token de Google y retorna el payload.
 * @param {string} idToken
 * @returns {{ sub: string, email: string, name: string, picture: string | undefined }}
 */
export async function verifyGoogleToken(idToken) {
  if (!env.googleClientId) {
    const error = new Error("Google Client ID no configurado en el servidor");
    error.status = 500;
    throw error;
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
  } catch {
    const error = new Error("Token de Google inválido o expirado");
    error.status = 401;
    throw error;
  }

  const payload = ticket.getPayload();

  if (!payload?.email || !payload?.sub) {
    const error = new Error("Token de Google no contiene datos de usuario válidos");
    error.status = 401;
    throw error;
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    picture: payload.picture ?? null,
  };
}
