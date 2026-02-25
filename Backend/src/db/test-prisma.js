import { prisma } from "./prisma.js";

async function main() {
  await prisma.$connect();

  const [row] = await prisma.$queryRaw`SELECT now() as now, current_database() as db`;
  console.log("Conexion Prisma OK");
  console.log("DB:", row.db);
  console.log("Server time:", row.now);
}

main()
  .catch((error) => {
    console.error("Error de conexion Prisma:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
