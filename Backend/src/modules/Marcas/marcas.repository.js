import { prisma } from "../../db/prisma.js";

export async function findAll() {
  return prisma.marcas.findMany({ orderBy: { nombre: "asc" } });
}

export async function findById(id) {
  return prisma.marcas.findUnique({ where: { id } });
}

export async function existsByNombre(nombre, excludeId = null) {
  const where = { nombre: { equals: nombre.trim(), mode: "insensitive" } };
  if (excludeId !== null) where.id = { not: excludeId };
  return (await prisma.marcas.count({ where })) > 0;
}

export async function create(data) {
  return prisma.marcas.create({ data });
}

export async function update(id, data) {
  return prisma.marcas.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.marcas.delete({ where: { id } });
}
