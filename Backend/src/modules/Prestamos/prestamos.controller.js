// ─── Controller para Prestamos ────────────────────────────────────────────────
import * as service from "./prestamos.service.js";

export async function getPrestamos(req, res) {
  try {
    const prestamos = await service.getAll(req.query);
    return res.status(200).json(prestamos);
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
    }
    if (error.status === 409) {
      return res.status(409).json({ mensaje: error.message });
    }
    console.error("getPrestamos:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function getPrestamo(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número entero" });
    }

    const prestamo = await service.getById(id);
    if (!prestamo) {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    return res.status(200).json(prestamo);
  } catch (error) {
    console.error("getPrestamo:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function createPrestamo(req, res) {
  try {
    const creado = await service.create(req.body);
    return res.status(201).json(creado);
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
    }
    if (error.status === 409) {
      return res.status(409).json({ mensaje: error.message });
    }
    console.error("createPrestamo:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function updatePrestamo(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número entero" });
    }

    const actualizado = await service.update(id, req.body);
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    return res.status(200).json({
      mensaje: "Préstamo actualizado exitosamente",
      data: actualizado,
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
    }
    if (error.status === 409) {
      return res.status(409).json({ mensaje: error.message });
    }
    console.error("updatePrestamo:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function deletePrestamo(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número entero" });
    }

    const eliminado = await service.remove(id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    return res.status(200).json({ mensaje: "Préstamo eliminado exitosamente" });
  } catch (error) {
    console.error("deletePrestamo:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
