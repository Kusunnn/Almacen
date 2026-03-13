export interface AuthUser {
  id: number;
  nombre: string;
  edad: number | null;
  telefono: string | null;
  direccion: string | null;
  correo: string;
  idRol: number | null;
  rolNombre: string | null;
  fechaRegistro: string | null;
  fotoPerfil: string | null;
}

export interface LoginResponse {
  mensaje: string;
  usuario: AuthUser;
}
