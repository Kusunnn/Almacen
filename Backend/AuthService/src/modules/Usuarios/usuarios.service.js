import bcrypt from "bcryptjs";
import { usuariosRepository } from "./usuarios.repository.js";
import { verifyGoogleToken } from "../../auth/google.js";

const SALT_ROUNDS = 10;
// Rol por defecto para usuarios que se registran con Google
const ROL_DEFAULT_GOOGLE = 15; // Técnico

function buildError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export const usuariosService = {
  async listarRoles() {
    return usuariosRepository.findRoles();
  },

  async autenticar({ correo, contrasena }) {
    const usuario = await usuariosRepository.findByCorreo(correo);
    if (!usuario) throw buildError("Credenciales inválidas", 401);

    // Usuarios registrados con Google no tienen contraseña local
    if (!usuario.contrasena) {
      throw buildError("Esta cuenta fue creada con Google. Inicia sesión con Google.", 401);
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) throw buildError("Credenciales inválidas", 401);

    return usuario;
  },

  async autenticarConGoogle(idToken) {
    const googlePayload = await verifyGoogleToken(idToken);

    // 1. Buscar por google_id primero (usuario ya vinculado)
    let usuario = await usuariosRepository.findByGoogleId(googlePayload.sub);

    if (!usuario) {
      // 2. Buscar por correo (puede que ya existiera con email/contraseña)
      const existentePorCorreo = await usuariosRepository.findByCorreo(googlePayload.email);

      if (existentePorCorreo) {
        // Vincular la cuenta existente con Google
        usuario = await usuariosRepository.update(existentePorCorreo.id, {
          google_id: googlePayload.sub,
          foto_perfil: existentePorCorreo.foto_perfil ?? googlePayload.picture,
        });
      } else {
        // 3. Crear nuevo usuario con datos de Google
        usuario = await usuariosRepository.createFromGoogle({
          nombre: googlePayload.name,
          correo: googlePayload.email,
          google_id: googlePayload.sub,
          foto_perfil: googlePayload.picture ?? null,
          roles: { connect: { id: ROL_DEFAULT_GOOGLE } },
        });
      }
    }

    return usuario;
  },

  async listar(filtros) {
    return usuariosRepository.findAll(filtros);
  },

  async obtenerPorId(id) {
    const usuario = await usuariosRepository.findById(id);
    if (!usuario) throw buildError("Usuario no encontrado", 404);
    return usuario;
  },

  async crear(data) {
    const existente = await usuariosRepository.findByCorreo(data.correo);
    if (existente) {
      throw buildError("Ya existe un usuario con ese correo", 409);
    }

    if (data.roles?.connect?.id) {
      const rolExiste = await usuariosRepository.existsRol(data.roles.connect.id);
      if (!rolExiste) {
        throw buildError("El rol indicado no existe", 400);
      }
    }

    const dataConHash = {
      ...data,
      contrasena: await bcrypt.hash(data.contrasena, SALT_ROUNDS),
    };

    return usuariosRepository.create(dataConHash);
  },

  async actualizar(id, data) {
    const actual = await usuariosRepository.findById(id);
    if (!actual) throw buildError("Usuario no encontrado", 404);

    if (data.correo && data.correo.toLowerCase() !== String(actual.correo).toLowerCase()) {
      const existente = await usuariosRepository.findByCorreo(data.correo);
      if (existente && existente.id !== id) {
        throw buildError("Ya existe un usuario con ese correo", 400);
      }
    }

    if (data.roles?.connect?.id) {
      const rolExiste = await usuariosRepository.existsRol(data.roles.connect.id);
      if (!rolExiste) {
        throw buildError("El rol indicado no existe", 400);
      }
    }

    const dataNormalizada = { ...data };
    if (dataNormalizada.contrasena) {
      dataNormalizada.contrasena = await bcrypt.hash(dataNormalizada.contrasena, SALT_ROUNDS);
    }

    return usuariosRepository.update(id, dataNormalizada);
  },

  async eliminar(id) {
    const actual = await usuariosRepository.findById(id);
    if (!actual) throw buildError("Usuario no encontrado", 404);

    return usuariosRepository.delete(id);
  },
};
