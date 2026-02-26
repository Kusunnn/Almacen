// ─── Repository para Prestamos ────────────────────────────────────────────────
import { prisma } from "../../db/prisma.js";

const includeRelations = {
  usuarios: {
    select: { id: true, nombre: true, correo: true },
  },
  herramientas: {
    select: { id: true, nombre: true, estado: true, disponibilidad: true },
  },
};

export async function findAll(filters = {}) {
  const where = {};

  if (filters.id_usuario !== undefined) where.id_usuario = filters.id_usuario;
  if (filters.id_herramienta !== undefined) where.id_herramienta = filters.id_herramienta;
  if (filters.estado) where.estado = { equals: filters.estado, mode: "insensitive" };

  return prisma.prestamos.findMany({
    where,
    include: includeRelations,
    orderBy: { fecha_prestamo: "desc" },
  });
}

export async function findById(id) {
  return prisma.prestamos.findUnique({
    where: { id },
    include: includeRelations,
  });
}

export async function existsUsuario(id) {
  const count = await prisma.usuarios.count({ where: { id } });
  return count > 0;
}

export async function existsHerramienta(id) {
  const count = await prisma.herramientas.count({ where: { id } });
  return count > 0;
}

export async function existsPrestamoActivoByHerramienta(idHerramienta, excludeId = null) {
  const where = {
    id_herramienta: idHerramienta,
    fecha_devolucion_real: null,
    estado: { not: "devuelto" },
  };

  if (excludeId !== null) where.id = { not: excludeId };

  const count = await prisma.prestamos.count({ where });
  return count > 0;
}

export async function create(data) {
  return prisma.prestamos.create({
    data,
    include: includeRelations,
  });
}

export async function update(id, data) {
  return prisma.prestamos.update({
    where: { id },
    data,
    include: includeRelations,
  });
}

export async function remove(id) {
  return prisma.prestamos.delete({ where: { id } });
}

export async function updateHerramientaDisponibilidad(idHerramienta, disponibilidad) {
  return prisma.herramientas.update({
    where: { id: idHerramienta },
    data: { disponibilidad },
  });
}
