// ─── Repository para Herramientas ────────────────────────────────────────────
// Capa de acceso a datos (equivalente al DbContext en EF Core).
// Toda interacción con Prisma queda aquí, el service nunca llama a Prisma directamente.

import { prisma } from "../../db/prisma.js";

/**
 * Retorna todas las herramientas ordenadas por id descendente.
 */
export async function findAll() {
    return prisma.herramientas.findMany({
        orderBy: { id: "desc" },
    });
}

/**
 * Busca una herramienta por id. Retorna null si no existe.
 * @param {number} id
 */
export async function findById(id) {
    return prisma.herramientas.findUnique({
        where: { id },
    });
}

/**
 * Verifica si ya existe una herramienta con ese nombre (ignorando mayúsculas).
 * @param {string} nombre
 * @param {number|null} excludeId  – excluye este id (útil en updates)
 */
export async function existsByNombre(nombre, excludeId = null) {
    const where = {
        nombre: { equals: nombre.trim(), mode: "insensitive" },
    };
    if (excludeId !== null) {
        where.id = { not: excludeId };
    }
    const count = await prisma.herramientas.count({ where });
    return count > 0;
}

/**
 * Crea una nueva herramienta y la retorna.
 * @param {import('@prisma/client').Prisma.herramientasCreateInput} data
 */
export async function create(data) {
    return prisma.herramientas.create({ data });
}

/**
 * Actualiza los campos de una herramienta existente.
 * @param {number} id
 * @param {import('@prisma/client').Prisma.herramientasUpdateInput} data
 */
export async function update(id, data) {
    return prisma.herramientas.update({ where: { id }, data });
}

/**
 * Elimina una herramienta por id.
 * @param {number} id
 */
export async function remove(id) {
    return prisma.herramientas.delete({ where: { id } });
}
