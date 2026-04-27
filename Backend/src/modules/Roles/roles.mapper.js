export function toRolDto(rol) {
  return {
    id: rol.id,
    nombre: rol.nombre,
  };
}

export function toRolDtoList(roles) {
  return roles.map(toRolDto);
}

export function fromCreacionDto(dto) {
  return { nombre: dto.nombre.trim() };
}

export function fromModificacionDto(dto) {
  const data = {};
  if (dto.nombre !== undefined) data.nombre = dto.nombre.trim();
  return data;
}
