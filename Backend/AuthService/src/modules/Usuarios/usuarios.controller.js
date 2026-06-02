import { ZodError } from "zod";
import {
  usuarioActualizarDto,
  usuarioCrearDto,
  usuarioEliminarDto,
  usuarioFiltroDto,
  usuarioIdParamDto,
  usuarioLoginDto,
  googleLoginDto,
} from "./usuarios.dto.js";
import {
  toUsuarioCreateData,
  toUsuarioDto,
  toUsuarioListDto,
  toUsuarioUpdateData,
} from "./usuarios.mapper.js";
import { usuariosService } from "./usuarios.service.js";
import { signAuthToken } from "../../auth/jwt.js";

function handleControllerError(error, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      mensaje: "Datos inválidos",
      errores: error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      })),
    });
  }

  if (error?.status) {
    return res.status(error.status).json({
      mensaje: error.message,
      ...(error.detalles ? { detalles: error.detalles } : {}),
    });
  }

  return next(error);
}

export const usuariosController = {
  async listarRoles(_req, res, next) {
    try {
      const roles = await usuariosService.listarRoles();
      return res.json(
        roles.map((rol) => ({
          id: rol.id,
          nombre: rol.nombre,
        }))
      );
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async login(req, res, next) {
    try {
      const credenciales = usuarioLoginDto.parse(req.body);
      const usuario = await usuariosService.autenticar(credenciales);
      const token = signAuthToken(usuario);

      return res.json({
        mensaje: "Login exitoso",
        token,
        usuario: toUsuarioDto(usuario),
      });
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async loginConGoogle(req, res, next) {
    try {
      const { idToken } = googleLoginDto.parse(req.body);
      const usuario = await usuariosService.autenticarConGoogle(idToken);
      const token = signAuthToken(usuario);

      return res.json({
        mensaje: "Login con Google exitoso",
        token,
        usuario: toUsuarioDto(usuario),
      });
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async me(req, res, next) {
    try {
      const id = Number(req.auth?.sub);
      const usuario = await usuariosService.obtenerPorId(id);

      return res.json({
        usuario: toUsuarioDto(usuario),
      });
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async listar(req, res, next) {
    try {
      const filtros = usuarioFiltroDto.parse(req.query);
      const usuarios = await usuariosService.listar(filtros);
      return res.json(toUsuarioListDto(usuarios));
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = usuarioIdParamDto.parse(req.params);
      const usuario = await usuariosService.obtenerPorId(id);
      return res.json(toUsuarioDto(usuario));
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async crear(req, res, next) {
    try {
      const dto = usuarioCrearDto.parse(req.body);
      const data = toUsuarioCreateData(dto);

      const usuarioCreado = await usuariosService.crear(data);
      return res.status(201).json(toUsuarioDto(usuarioCreado));
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { id } = usuarioIdParamDto.parse(req.params);
      const dto = usuarioActualizarDto.parse(req.body);
      const data = toUsuarioUpdateData(dto);

      const usuarioActualizado = await usuariosService.actualizar(id, data);
      return res.json({
        mensaje: "Usuario actualizado exitosamente",
        data: toUsuarioDto(usuarioActualizado),
      });
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async eliminar(req, res, next) {
    try {
      const { id } = usuarioEliminarDto.parse(req.params);
      await usuariosService.eliminar(id);

      return res.json({ mensaje: "Usuario eliminado exitosamente" });
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },
};
