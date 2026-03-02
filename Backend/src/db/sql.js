import dotenv from "dotenv";
import dns from "node:dns";
import postgres from "postgres";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

// Si tu red no rutea IPv6 bien (tu caso), esto evita que Node elija AAAA primero
dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("FALTA DATABASE_URL en .env");

// Supabase requiere SSL
const sql = postgres(connectionString, {
  ssl: "require",
  // opcional: timeouts para que no se quede colgado
  connect_timeout: 10,
  idle_timeout: 20,
});

export default sql;
