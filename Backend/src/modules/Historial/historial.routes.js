import { Router } from "express";
import {
  createHistorialItem,
  deleteHistorialItem,
  getHistorial,
  getHistorialItem,
  updateHistorialItem,
} from "./historial.controller.js";

const router = Router();

router.get("/", getHistorial);
router.get("/:id", getHistorialItem);
router.post("/", createHistorialItem);
router.put("/:id", updateHistorialItem);
router.delete("/:id", deleteHistorialItem);

export default router;
