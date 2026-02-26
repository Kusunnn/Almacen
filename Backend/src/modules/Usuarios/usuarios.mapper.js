export function toUsuarioDto(usuario) {
  if (!usuario) return null;

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    edad: usuario.edad,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    correo: usuario.correo,
    idRol: usuario.id_rol ?? usuario.idRol ?? null,
    fechaRegistro: usuario.fecha_registro ?? usuario.fechaRegistro ?? null,
  };
}

export function toUsuarioListDto(usuarios = []) {
  return usuarios.map(toUsuarioDto);
}

export function toUsuarioCreateData(dto) {
  return {
    nombre: dto.nombre,
    edad: dto.edad,
    telefono: dto.telefono,
    direccion: dto.direccion,
    correo: dto.correo,
    contrasena: dto.contrasena,
    id_rol: dto.idRol,
  };
}

export function toUsuarioUpdateData(dto) {
  const data = {};

  if (dto.nombre !== undefined) data.nombre = dto.nombre;
  if (dto.edad !== undefined) data.edad = dto.edad;
  if (dto.telefono !== undefined) data.telefono = dto.telefono;
  if (dto.direccion !== undefined) data.direccion = dto.direccion;
  if (dto.correo !== undefined) data.correo = dto.correo;
  if (dto.contrasena !== undefined) data.contrasena = dto.contrasena;
  if (dto.idRol !== undefined) data.id_rol = dto.idRol;

  return data;
}
