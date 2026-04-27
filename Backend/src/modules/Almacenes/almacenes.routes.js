import { Router } from "express";
import {
  createAlmacen,
  deleteAlmacen,
  getAlmacen,
  getAlmacenes,
  updateAlmacen,
} from "./almacenes.controller.js";

const router = Router();

router.get("/", getAlmacenes);
router.get("/:id", getAlmacen);
router.post("/", createAlmacen);
router.put("/:id", updateAlmacen);
router.delete("/:id", deleteAlmacen);

export default router;
