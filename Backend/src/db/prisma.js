import dns from "node:dns";
import { PrismaClient } from "@prisma/client";
import "../config/env.js";

dns.setDefaultResultOrder("ipv4first");

export const prisma = new PrismaClient();
