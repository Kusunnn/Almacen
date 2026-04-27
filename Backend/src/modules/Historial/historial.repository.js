import { prisma } from "../../db/prisma.js";

const includeRelations = {
  usuarios: {
    select: { id: true, nombre: true, correo: true },
  },
  herramientas: {
    select: { id: true, nombre: true },
  },
};

export async function findAll(filters = {}) {
  const where = {};
  if (filters.id_usuario !== undefined) where.id_usuario = filters.id_usuario;
  if (filters.id_herramienta !== undefined) where.id_herramienta = filters.id_herramienta;

  return prisma.historial.findMany({
    where,
    include: includeRelations,
    orderBy: { fecha_movimiento: "desc" },
  });
}

export async function findById(id) {
  return prisma.historial.findUnique({
    where: { id },
    include: includeRelations,
  });
}

export async function existsUsuario(id) {
  return (await prisma.usuarios.count({ where: { id } })) > 0;
}

export async function existsHerramienta(id) {
  return (await prisma.herramientas.count({ where: { id } })) > 0;
}

export async function create(data) {
  return prisma.historial.create({
    data,
    include: includeRelations,
  });
}

export async function update(id, data) {
  return prisma.historial.update({
    where: { id },
    data,
    include: includeRelations,
  });
}

export async function remove(id) {
  return prisma.historial.delete({ where: { id } });
}
