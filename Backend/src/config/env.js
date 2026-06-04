import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001/api/auth",
};
