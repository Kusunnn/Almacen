import { prisma } from "../../db/prisma.js";

// Si tu modelo en Prisma se llama distinto (por ejemplo "usuario" en singular),
// cambia esta referencia una sola vez aquí.
const usuariosModel = prisma.usuarios;

const includeRelations = {
  roles: {
    select: { id: true, nombre: true },
  },
};

export const usuariosRepository = {
  findRoles() {
    return prisma.roles.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async existsRol(id) {
    const count = await prisma.roles.count({ where: { id } });
    return count > 0;
  },

  findAll(filters = {}) {
    const where = {};

    // Filtros opcionales para listados (correo / rol)
    if (filters.correo) {
      where.correo = { equals: filters.correo, mode: "insensitive" };
    }

    if (filters.idRol !== undefined) {
      where.id_rol = filters.idRol;
    }

    return usuariosModel.findMany({
      where,
      include: includeRelations,
      orderBy: { fecha_registro: "desc" },
    });
  },

  findById(id) {
    return usuariosModel.findUnique({
      where: { id },
      include: includeRelations,
    });
  },

  findByCorreo(correo) {
    return usuariosModel.findFirst({
      where: { correo: { equals: correo, mode: "insensitive" } },
      include: includeRelations,
    });
  },

  create(data) {
    return usuariosModel.create({
      data,
      include: includeRelations,
    });
  },

  update(id, data) {
    return usuariosModel.update({
      where: { id },
      data,
      include: includeRelations,
    });
  },

  delete(id) {
    return usuariosModel.delete({ where: { id } });
  },
};
