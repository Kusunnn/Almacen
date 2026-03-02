import bcrypt from "bcryptjs";
import { usuariosRepository } from "./usuarios.repository.js";

const SALT_ROUNDS = 10;

function buildError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export const usuariosService = {
  async listar(filtros) {
    return usuariosRepository.findAll(filtros);
  },

  async obtenerPorId(id) {
    const usuario = await usuariosRepository.findById(id);
    if (!usuario) throw buildError("Usuario no encontrado", 404);
    return usuario;
  },

  async crear(data) {
    // Validación de negocio: correo único
    const existente = await usuariosRepository.findByCorreo(data.correo);
    if (existente) {
      throw buildError("Ya existe un usuario con ese correo", 400);
    }

    // Guardamos la contraseña hasheada, nunca en texto plano.
    const dataConHash = {
      ...data,
      contrasena: await bcrypt.hash(data.contrasena, SALT_ROUNDS),
    };

    return usuariosRepository.create(dataConHash);
  },

  async actualizar(id, data) {
    const actual = await usuariosRepository.findById(id);
    if (!actual) throw buildError("Usuario no encontrado", 404);

    // Solo valida duplicado si se intenta cambiar el correo
    if (data.correo && data.correo.toLowerCase() !== String(actual.correo).toLowerCase()) {
      const existente = await usuariosRepository.findByCorreo(data.correo);
      if (existente && existente.id !== id) {
        throw buildError("Ya existe un usuario con ese correo", 400);
      }
    }

    // Si viene contraseña en un update, también se hashea antes de guardar.
    const dataNormalizada = { ...data };
    if (dataNormalizada.contrasena) {
      dataNormalizada.contrasena = await bcrypt.hash(
        dataNormalizada.contrasena,
        SALT_ROUNDS
      );
    }

    return usuariosRepository.update(id, dataNormalizada);
  },

  async eliminar(id) {
    const actual = await usuariosRepository.findById(id);
    if (!actual) throw buildError("Usuario no encontrado", 404);

    return usuariosRepository.delete(id);
  },
};
