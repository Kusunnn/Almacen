import { prisma } from "../../db/prisma.js";

export async function findAll() {
  return prisma.almacenes.findMany({ orderBy: { id: "desc" } });
}

export async function findById(id) {
  return prisma.almacenes.findUnique({ where: { id } });
}

export async function existsByNombre(nombre, excludeId = null) {
  const where = { nombre: { equals: nombre.trim(), mode: "insensitive" } };
  if (excludeId !== null) where.id = { not: excludeId };
  return (await prisma.almacenes.count({ where })) > 0;
}

export async function create(data) {
  return prisma.almacenes.create({ data });
}

export async function update(id, data) {
  return prisma.almacenes.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.almacenes.delete({ where: { id } });
}
