export function toTipoHerramientaDto(tipo) {
  return {
    id: tipo.id,
    nombre: tipo.nombre,
  };
}

export function toTipoHerramientaDtoList(tipos) {
  return tipos.map(toTipoHerramientaDto);
}

export function fromCreacionDto(dto) {
  return { nombre: dto.nombre.trim() };
}

export function fromModificacionDto(dto) {
  const data = {};
  if (dto.nombre !== undefined) data.nombre = dto.nombre.trim();
  return data;
}
