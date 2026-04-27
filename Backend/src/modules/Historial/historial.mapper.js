function toIsoOrNull(value) {
  return value ? new Date(value).toISOString() : null;
}

export function toHistorialDto(historial) {
  return {
    id: historial.id,
    id_usuario: historial.id_usuario ?? null,
    id_herramienta: historial.id_herramienta ?? null,
    fecha_movimiento: toIsoOrNull(historial.fecha_movimiento),
    usuario: historial.usuarios
      ? {
          id: historial.usuarios.id,
          nombre: historial.usuarios.nombre,
          correo: historial.usuarios.correo ?? null,
        }
      : null,
    herramienta: historial.herramientas
      ? {
          id: historial.herramientas.id,
          nombre: historial.herramientas.nombre,
        }
      : null,
  };
}

export function toHistorialDtoList(historial) {
  return historial.map(toHistorialDto);
}

export function fromCreacionDto(dto) {
  return {
    id_usuario: dto.id_usuario ?? null,
    id_herramienta: dto.id_herramienta ?? null,
    fecha_movimiento: dto.fecha_movimiento ? new Date(dto.fecha_movimiento) : undefined,
  };
}

export function fromModificacionDto(dto) {
  const data = {};
  if (dto.id_usuario !== undefined) data.id_usuario = dto.id_usuario;
  if (dto.id_herramienta !== undefined) data.id_herramienta = dto.id_herramienta;
  if (dto.fecha_movimiento !== undefined) {
    data.fecha_movimiento = dto.fecha_movimiento ? new Date(dto.fecha_movimiento) : null;
  }
  return data;
}
