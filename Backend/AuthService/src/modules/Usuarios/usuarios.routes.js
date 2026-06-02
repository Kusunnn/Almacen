import { Router } from "express";
import { usuariosController } from "./usuarios.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.get("/roles", usuariosController.listarRoles);
router.post("/login", usuariosController.login);
router.post("/google", usuariosController.loginConGoogle);
router.post("/register", usuariosController.crear);
router.get("/me", authenticate, usuariosController.me);

router.get("/users", usuariosController.listar);
router.get("/users/:id", usuariosController.obtenerPorId);
router.post("/users", usuariosController.crear);
router.put("/users/:id", usuariosController.actualizar);
router.delete("/users/:id", usuariosController.eliminar);

export default router;
