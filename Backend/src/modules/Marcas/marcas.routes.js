import { Router } from "express";
import {
  createMarca,
  deleteMarca,
  getMarca,
  getMarcas,
  updateMarca,
} from "./marcas.controller.js";

const router = Router();

router.get("/", getMarcas);
router.get("/:id", getMarca);
router.post("/", createMarca);
router.put("/:id", updateMarca);
router.delete("/:id", deleteMarca);

export default router;
