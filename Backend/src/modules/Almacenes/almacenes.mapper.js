export function toAlmacenDto(almacen) {
  return {
    id: almacen.id,
    nombre: almacen.nombre,
    telefono: almacen.telefono ?? null,
    direccion: almacen.direccion ?? null,
  };
}

export function toAlmacenDtoList(almacenes) {
  return almacenes.map(toAlmacenDto);
}

export function fromCreacionDto(dto) {
  return {
    nombre: dto.nombre.trim(),
    telefono: dto.telefono ?? null,
    direccion: dto.direccion ?? null,
  };
}

export function fromModificacionDto(dto) {
  const data = {};
  if (dto.nombre !== undefined) data.nombre = dto.nombre.trim();
  if (dto.telefono !== undefined) data.telefono = dto.telefono;
  if (dto.direccion !== undefined) data.direccion = dto.direccion;
  return data;
}
