// ─── Controller para Herramientas ─────────────────────────────────────────────
// Maneja las peticiones HTTP y delega al service.
// Equivalente al CategoriasController de C#.

import * as service from "./herramientas.service.js";

// ── GET /api/herramientas ─────────────────────────────────────────────────────
export async function getHerramientas(req, res) {
    try {
        const herramientas = await service.getAll();
        return res.status(200).json(herramientas);
    } catch (error) {
        console.error("getHerramientas:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}

// ── GET /api/herramientas/:id ─────────────────────────────────────────────────
export async function getHerramienta(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "El id debe ser un número entero" });
        }

        const herramienta = await service.getById(id);
        if (!herramienta) {
            return res.status(404).json({ mensaje: "Herramienta no encontrada" });
        }

        return res.status(200).json(herramienta);
    } catch (error) {
        console.error("getHerramienta:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}

// ── POST /api/herramientas ────────────────────────────────────────────────────
export async function createHerramienta(req, res) {
    try {
        const creada = await service.create(req.body);
        return res.status(201).json(creada);
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
        }
        if (error.status === 409) {
            return res.status(409).json({ mensaje: error.message });
        }
        console.error("createHerramienta:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}

// ── PUT /api/herramientas/:id ─────────────────────────────────────────────────
export async function updateHerramienta(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "El id debe ser un número entero" });
        }

        const actualizada = await service.update(id, req.body);
        if (!actualizada) {
            return res.status(404).json({ mensaje: "Herramienta no encontrada" });
        }

        return res.status(200).json({
            mensaje: "Herramienta actualizada exitosamente",
            data: actualizada,
        });
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({ mensaje: error.message, detalles: error.detalles });
        }
        if (error.status === 409) {
            return res.status(409).json({ mensaje: error.message });
        }
        console.error("updateHerramienta:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}

// ── DELETE /api/herramientas/:id ──────────────────────────────────────────────
export async function deleteHerramienta(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "El id debe ser un número entero" });
        }

        const eliminada = await service.remove(id);
        if (!eliminada) {
            return res.status(404).json({ mensaje: "Herramienta no encontrada" });
        }

        return res.status(200).json({ mensaje: "Herramienta eliminada exitosamente" });
    } catch (error) {
        console.error("deleteHerramienta:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}
