import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

export const env = {
  port: Number(process.env.AUTH_PORT ?? process.env.PORT_AUTH ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
  jwtSecret: process.env.JWT_SECRET ?? "almacen-auth-dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
};

