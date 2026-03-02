import dotenv from "dotenv";
import dns from "node:dns";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
dns.setDefaultResultOrder("ipv4first");

export const prisma = new PrismaClient();
