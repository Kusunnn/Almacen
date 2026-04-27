import { prisma } from "../../db/prisma.js";

export async function findAll() {
  return prisma.tipos_herramienta.findMany({ orderBy: { nombre: "asc" } });
}

export async function findById(id) {
  return prisma.tipos_herramienta.findUnique({ where: { id } });
}

export async function existsByNombre(nombre, excludeId = null) {
  const where = { nombre: { equals: nombre.trim(), mode: "insensitive" } };
  if (excludeId !== null) where.id = { not: excludeId };
  return (await prisma.tipos_herramienta.count({ where })) > 0;
}

export async function create(data) {
  return prisma.tipos_herramienta.create({ data });
}

export async function update(id, data) {
  return prisma.tipos_herramienta.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.tipos_herramienta.delete({ where: { id } });
}
