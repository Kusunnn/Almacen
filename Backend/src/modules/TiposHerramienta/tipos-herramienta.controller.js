import { Prisma } from "@prisma/client";
import { validarIdParam } from "./tipos-herramienta.dto.js";
import * as service from "./tipos-herramienta.service.js";

function handleError(error, res) {
  if (error.status === 400) {
    return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
  }
  if (error.status === 409) return res.status(409).json({ mensaje: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
    return res.status(409).json({ mensaje: "No se puede eliminar un tipo en uso" });
  }
  console.error("tipos_herramienta:", error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}

export async function getTiposHerramienta(_req, res) {
  try {
    return res.json(await service.getAll());
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getTipoHerramienta(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const tipo = await service.getById(id);
    if (!tipo) return res.status(404).json({ mensaje: "Tipo de herramienta no encontrado" });
    return res.json(tipo);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createTipoHerramienta(req, res) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateTipoHerramienta(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const actualizado = await service.update(id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: "Tipo de herramienta no encontrado" });
    return res.json({ mensaje: "Tipo de herramienta actualizado exitosamente", data: actualizado });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteTipoHerramienta(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const eliminado = await service.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Tipo de herramienta no encontrado" });
    return res.json({ mensaje: "Tipo de herramienta eliminado exitosamente" });
  } catch (error) {
    return handleError(error, res);
  }
}
