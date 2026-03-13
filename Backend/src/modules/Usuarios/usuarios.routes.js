import { Router } from "express";
import { usuariosController } from "./usuarios.controller.js";

const router = Router();

// GET /api/usuarios/roles
router.get("/roles", usuariosController.listarRoles);

// POST /api/usuarios/login
router.post("/login", usuariosController.login);

// GET /api/usuarios?correo=...&idRol=...
router.get("/", usuariosController.listar);

// GET /api/usuarios/:id
router.get("/:id", usuariosController.obtenerPorId);

// POST /api/usuarios
router.post("/", usuariosController.crear);

// PUT /api/usuarios/:id
router.put("/:id", usuariosController.actualizar);

// DELETE /api/usuarios/:id
router.delete("/:id", usuariosController.eliminar);

export default router;
