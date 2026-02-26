// ─── Rutas para Prestamos ─────────────────────────────────────────────────────
import { Router } from "express";
import {
  createPrestamo,
  deletePrestamo,
  getPrestamo,
  getPrestamos,
  updatePrestamo,
} from "./prestamos.controller.js";

const router = Router();

router.get("/", getPrestamos);
router.get("/:id", getPrestamo);
router.post("/", createPrestamo);
router.put("/:id", updatePrestamo);
router.delete("/:id", deletePrestamo);

export default router;
