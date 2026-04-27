import { Router } from "express";
import {
  createRol,
  deleteRol,
  getRol,
  getRoles,
  updateRol,
} from "./roles.controller.js";

const router = Router();

router.get("/", getRoles);
router.get("/:id", getRol);
router.post("/", createRol);
router.put("/:id", updateRol);
router.delete("/:id", deleteRol);

export default router;
