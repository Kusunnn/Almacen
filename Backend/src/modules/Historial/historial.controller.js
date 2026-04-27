import { validarIdParam } from "./historial.dto.js";
import * as service from "./historial.service.js";

function handleError(error, res) {
  if (error.status === 400) {
    return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
  }
  if (error.status === 409) return res.status(409).json({ mensaje: error.message });
  console.error("historial:", error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}

export async function getHistorial(req, res) {
  try {
    return res.json(await service.getAll(req.query));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getHistorialItem(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const historial = await service.getById(id);
    if (!historial) return res.status(404).json({ mensaje: "Registro de historial no encontrado" });
    return res.json(historial);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createHistorialItem(req, res) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateHistorialItem(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const actualizado = await service.update(id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: "Registro de historial no encontrado" });
    return res.json({ mensaje: "Registro de historial actualizado exitosamente", data: actualizado });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteHistorialItem(req, res) {
  try {
    const { id } = validarIdParam(req.params);
    const eliminado = await service.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Registro de historial no encontrado" });
    return res.json({ mensaje: "Registro de historial eliminado exitosamente" });
  } catch (error) {
    return handleError(error, res);
  }
}
