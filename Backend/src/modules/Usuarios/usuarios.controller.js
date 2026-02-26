import { ZodError } from "zod";
import {
  usuarioActualizarDto,
  usuarioCrearDto,
  usuarioEliminarDto,
  usuarioFiltroDto,
  usuarioIdParamDto,
} from "./usuarios.dto.js";
import {
  toUsuarioCreateData,
  toUsuarioDto,
  toUsuarioListDto,
  toUsuarioUpdateData,
} from "./usuarios.mapper.js";
import { usuariosService } from "./usuarios.service.js";

function handleControllerError(error, res, next) {
  // Errores de validación (zod)
  if (error instanceof ZodError) {
    return res.status(400).json({
      mensaje: "Datos inválidos",
      errores: error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      })),
    });
  }

  // Errores de negocio definidos en el service
  if (error?.status) {
    return res.status(error.status).json({ mensaje: error.message });
  }

  // Lo demás lo delegamos al middleware global (si existe)
  return next(error);
}

export const usuariosController = {
  async listar(req, res, next) {
    try {
      // Valida req.query (filtros opcionales)
      const filtros = usuarioFiltroDto.parse(req.query);
      const usuarios = await usuariosService.listar(filtros);
      return res.json(toUsuarioListDto(usuarios));
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      // Valida req.params.id y lo convierte a número
      const { id } = usuarioIdParamDto.parse(req.params);
      const usuario = await usuariosService.obtenerPorId(id);
      return res.json(toUsuarioDto(usuario));
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },

  async crear(req, res, next) {
    try {
      // Valida req.body para alta
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
      // Semánticamente explícito para DELETE (internamente es el mismo shape que params.id)
      const { id } = usuarioEliminarDto.parse(req.params);
      await usuariosService.eliminar(id);

      return res.json({ mensaje: "Usuario eliminado exitosamente" });
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  },
};
