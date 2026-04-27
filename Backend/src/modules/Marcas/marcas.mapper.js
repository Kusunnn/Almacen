export function toMarcaDto(marca) {
  return {
    id: marca.id,
    nombre: marca.nombre,
  };
}

export function toMarcaDtoList(marcas) {
  return marcas.map(toMarcaDto);
}

export function fromCreacionDto(dto) {
  return { nombre: dto.nombre.trim() };
}

export function fromModificacionDto(dto) {
  const data = {};
  if (dto.nombre !== undefined) data.nombre = dto.nombre.trim();
  return data;
}
