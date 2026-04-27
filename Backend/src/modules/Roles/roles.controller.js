import { Prisma } from "@prisma/client";
import { validarIdParam } from "./roles.dto.js";
import * as service from "./roles.service.js";

function handleError(error, res) {
  if (error.status === 400) {
    return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
  }
  if (error.status === 409) return res.status(409).json({ mensaje: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
    return res.status(409).json({ mensaje: "No se puede eliminar un rol en uso" });
  }
  console.error("roles:", error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}

export async function getRoles(_req, res) {
  try {
    return res.json(await service.getAll());
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getRol(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const rol = await service.getById(id);
    if (!rol) return res.status(404).json({ mensaje: "Rol no encontrado" });
    return res.json(rol);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createRol(req, res) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateRol(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const actualizado = await service.update(id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: "Rol no encontrado" });
    return res.json({ mensaje: "Rol actualizado exitosamente", data: actualizado });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteRol(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const eliminado = await service.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Rol no encontrado" });
    return res.json({ mensaje: "Rol eliminado exitosamente" });
  } catch (error) {
    return handleError(error, res);
  }
}
