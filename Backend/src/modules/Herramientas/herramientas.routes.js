// ─── Rutas para Herramientas ──────────────────────────────────────────────────
// Registra los endpoints Express y los mapea a los handlers del controller.

import { Router } from "express";
import {
    getHerramientas,
    getHerramienta,
    createHerramienta,
    updateHerramienta,
    deleteHerramienta,
} from "./herramientas.controller.js";

const router = Router();

// GET    /api/herramientas          → lista completa
// GET    /api/herramientas/:id      → una herramienta
// POST   /api/herramientas          → crear
// PUT    /api/herramientas/:id      → actualizar
// DELETE /api/herramientas/:id      → eliminar

router.get("/", getHerramientas);
router.get("/:id", getHerramienta);
router.post("/", createHerramienta);
router.put("/:id", updateHerramienta);
router.delete("/:id", deleteHerramienta);

export default router;
