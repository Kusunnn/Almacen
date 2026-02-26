// ─── Mapper para Prestamos ────────────────────────────────────────────────────

function toIsoOrNull(value) {
  return value ? new Date(value).toISOString() : null;
}

/**
 * @param {import('@prisma/client').prestamos & {usuarios?: any, herramientas?: any}} prestamo
 */
export function toPrestamoDto(prestamo) {
  return {
    id: prestamo.id,
    id_usuario: prestamo.id_usuario ?? null,
    id_herramienta: prestamo.id_herramienta ?? null,
    fecha_prestamo: toIsoOrNull(prestamo.fecha_prestamo),
    fecha_devolucion_estimada: toIsoOrNull(prestamo.fecha_devolucion_estimada),
    fecha_devolucion_real: toIsoOrNull(prestamo.fecha_devolucion_real),
    estado: prestamo.estado ?? null,
    observaciones: prestamo.observaciones ?? null,
    usuario: prestamo.usuarios
      ? {
          id: prestamo.usuarios.id,
          nombre: prestamo.usuarios.nombre,
          correo: prestamo.usuarios.correo ?? null,
        }
      : null,
    herramienta: prestamo.herramientas
      ? {
          id: prestamo.herramientas.id,
          nombre: prestamo.herramientas.nombre,
          estado: prestamo.herramientas.estado ?? null,
          disponibilidad: prestamo.herramientas.disponibilidad ?? null,
        }
      : null,
  };
}

export function toPrestamoDtoList(prestamos) {
  return prestamos.map(toPrestamoDto);
}

export function fromCreacionDto(dto) {
  return {
    id_usuario: dto.id_usuario,
    id_herramienta: dto.id_herramienta,
    fecha_prestamo: dto.fecha_prestamo ? new Date(dto.fecha_prestamo) : undefined,
    fecha_devolucion_estimada: dto.fecha_devolucion_estimada
      ? new Date(dto.fecha_devolucion_estimada)
      : null,
    fecha_devolucion_real: dto.fecha_devolucion_real
      ? new Date(dto.fecha_devolucion_real)
      : null,
    estado: dto.estado ?? "activo",
    observaciones: dto.observaciones ?? null,
  };
}

export function fromModificacionDto(dto) {
  const data = {};

  if (dto.id_usuario !== undefined) data.id_usuario = dto.id_usuario;
  if (dto.id_herramienta !== undefined) data.id_herramienta = dto.id_herramienta;
  if (dto.fecha_prestamo !== undefined) {
    data.fecha_prestamo = dto.fecha_prestamo ? new Date(dto.fecha_prestamo) : null;
  }
  if (dto.fecha_devolucion_estimada !== undefined) {
    data.fecha_devolucion_estimada = dto.fecha_devolucion_estimada
      ? new Date(dto.fecha_devolucion_estimada)
      : null;
  }
  if (dto.fecha_devolucion_real !== undefined) {
    data.fecha_devolucion_real = dto.fecha_devolucion_real
      ? new Date(dto.fecha_devolucion_real)
      : null;
  }
  if (dto.estado !== undefined) data.estado = dto.estado;
  if (dto.observaciones !== undefined) data.observaciones = dto.observaciones;

  return data;
}
