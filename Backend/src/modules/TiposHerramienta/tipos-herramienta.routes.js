import { Router } from "express";
import {
  createTipoHerramienta,
  deleteTipoHerramienta,
  getTipoHerramienta,
  getTiposHerramienta,
  updateTipoHerramienta,
} from "./tipos-herramienta.controller.js";

const router = Router();

router.get("/", getTiposHerramienta);
router.get("/:id", getTipoHerramienta);
router.post("/", createTipoHerramienta);
router.put("/:id", updateTipoHerramienta);
router.delete("/:id", deleteTipoHerramienta);

export default router;
