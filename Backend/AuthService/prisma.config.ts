import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { defineConfig, env } from "prisma/config";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
