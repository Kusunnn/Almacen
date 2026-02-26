import { prisma } from "../../db/prisma.js";

// Si tu modelo en Prisma se llama distinto (por ejemplo "usuario" en singular),
// cambia esta referencia una sola vez aquí.
const usuariosModel = prisma.usuarios;

export const usuariosRepository = {
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
      orderBy: { fecha_registro: "desc" },
    });
  },

  findById(id) {
    return usuariosModel.findUnique({ where: { id } });
  },

  findByCorreo(correo) {
    return usuariosModel.findFirst({
      where: { correo: { equals: correo, mode: "insensitive" } },
    });
  },

  create(data) {
    return usuariosModel.create({ data });
  },

  update(id, data) {
    return usuariosModel.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return usuariosModel.delete({ where: { id } });
  },
};
