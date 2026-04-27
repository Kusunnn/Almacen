import { Prisma } from "@prisma/client";
import { validarIdParam } from "./marcas.dto.js";
import * as service from "./marcas.service.js";

function handleError(error, res) {
  if (error.status === 400) {
    return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
  }
  if (error.status === 409) return res.status(409).json({ mensaje: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
    return res.status(409).json({ mensaje: "No se puede eliminar una marca en uso" });
  }
  console.error("marcas:", error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}

export async function getMarcas(_req, res) {
  try {
    return res.json(await service.getAll());
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getMarca(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const marca = await service.getById(id);
    if (!marca) return res.status(404).json({ mensaje: "Marca no encontrada" });
    return res.json(marca);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createMarca(req, res) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateMarca(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const actualizado = await service.update(id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: "Marca no encontrada" });
    return res.json({ mensaje: "Marca actualizada exitosamente", data: actualizado });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteMarca(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const eliminado = await service.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Marca no encontrada" });
    return res.json({ mensaje: "Marca eliminada exitosamente" });
  } catch (error) {
    return handleError(error, res);
  }
}
