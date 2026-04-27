import { Prisma } from "@prisma/client";
import { validarIdParam } from "./almacenes.dto.js";
import * as service from "./almacenes.service.js";

function handleError(error, res) {
  if (error.status === 400) {
    return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
  }
  if (error.status === 409) return res.status(409).json({ mensaje: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
    return res.status(409).json({ mensaje: "No se puede eliminar un almacén en uso" });
  }
  console.error("almacenes:", error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}

export async function getAlmacenes(_req, res) {
  try {
    return res.json(await service.getAll());
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getAlmacen(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const almacen = await service.getById(id);
    if (!almacen) return res.status(404).json({ mensaje: "Almacén no encontrado" });
    return res.json(almacen);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createAlmacen(req, res) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateAlmacen(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const actualizado = await service.update(id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: "Almacén no encontrado" });
    return res.json({ mensaje: "Almacén actualizado exitosamente", data: actualizado });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteAlmacen(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const eliminado = await service.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Almacén no encontrado" });
    return res.json({ mensaje: "Almacén eliminado exitosamente" });
  } catch (error) {
    return handleError(error, res);
  }
}
