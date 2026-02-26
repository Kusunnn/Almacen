// ─── Mapper para Herramientas ─────────────────────────────────────────────────
// Convierte entre entidades de Prisma y DTOs (similar a AutoMapper en C#).

/**
 * Mapea una entidad `herramientas` de Prisma a un HerramientaDto.
 * @param {import('@prisma/client').herramientas} herramienta
 * @returns {import('./herramientas.dto.js').HerramientaDto}
 */
export function toHerramientaDto(herramienta) {
    return {
        id: herramienta.id,
        nombre: herramienta.nombre,
        descripcion: herramienta.descripcion ?? null,
        id_tipo: herramienta.id_tipo ?? null,
        id_marca: herramienta.id_marca ?? null,
        estado: herramienta.estado ?? null,
        fecha_ingreso: herramienta.fecha_ingreso
            ? herramienta.fecha_ingreso.toISOString().split("T")[0]
            : null,
        disponibilidad: herramienta.disponibilidad ?? null,
        id_almacen: herramienta.id_almacen ?? null,
        foto_herramienta: herramienta.foto_herramienta ?? null,
    };
}

/**
 * Mapea una lista de entidades a una lista de DTOs.
 * @param {import('@prisma/client').herramientas[]} herramientas
 * @returns {import('./herramientas.dto.js').HerramientaDto[]}
 */
export function toHerramientaDtoList(herramientas) {
    return herramientas.map(toHerramientaDto);
}

/**
 * Mapea un HerramientaCreacionDto a los datos de creación de Prisma.
 * @param {import('./herramientas.dto.js').HerramientaCreacionDto} dto
 * @returns {import('@prisma/client').Prisma.herramientasCreateInput}
 */
export function fromCreacionDto(dto) {
    return {
        nombre: dto.nombre.trim(),
        descripcion: dto.descripcion ?? null,
        estado: dto.estado ?? null,
        fecha_ingreso: dto.fecha_ingreso ? new Date(dto.fecha_ingreso) : null,
        disponibilidad: dto.disponibilidad ?? true,
        foto_herramienta: dto.foto_herramienta ?? null,
        ...(dto.id_tipo ? { tipos_herramienta: { connect: { id: Number(dto.id_tipo) } } } : {}),
        ...(dto.id_marca ? { marcas: { connect: { id: Number(dto.id_marca) } } } : {}),
        ...(dto.id_almacen ? { almacenes: { connect: { id: Number(dto.id_almacen) } } } : {}),
    };
}

/**
 * Mapea un HerramientaModificacionDto a los datos de actualización de Prisma.
 * @param {import('./herramientas.dto.js').HerramientaModificacionDto} dto
 * @returns {import('@prisma/client').Prisma.herramientasUpdateInput}
 */
export function fromModificacionDto(dto) {
    return {
        nombre: dto.nombre.trim(),
        descripcion: dto.descripcion ?? null,
        estado: dto.estado ?? null,
        fecha_ingreso: dto.fecha_ingreso ? new Date(dto.fecha_ingreso) : null,
        disponibilidad: dto.disponibilidad ?? null,
        foto_herramienta: dto.foto_herramienta ?? null,
        // Relaciones – si vienen null se desconectan, si vienen con id se conectan
        tipos_herramienta: dto.id_tipo
            ? { connect: { id: Number(dto.id_tipo) } }
            : { disconnect: true },
        marcas: dto.id_marca
            ? { connect: { id: Number(dto.id_marca) } }
            : { disconnect: true },
        almacenes: dto.id_almacen
            ? { connect: { id: Number(dto.id_almacen) } }
            : { disconnect: true },
    };
}
