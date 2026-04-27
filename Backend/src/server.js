import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import almacenesRouter from "./modules/Almacenes/almacenes.routes.js";
import herramientasRouter from "./modules/Herramientas/herramientas.routes.js";
import historialRouter from "./modules/Historial/historial.routes.js";
import marcasRouter from "./modules/Marcas/marcas.routes.js";
import prestamosRouter from "./modules/Prestamos/prestamos.routes.js";
import rolesRouter from "./modules/Roles/roles.routes.js";
import tiposHerramientaRouter from "./modules/TiposHerramienta/tipos-herramienta.routes.js";
import usuariosRouter from "./modules/Usuarios/usuarios.routes.js"; 

const app = express();

app.disable("etag");

// ── Middleware global ─────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use("/api/almacenes", almacenesRouter);
app.use("/api/herramientas", herramientasRouter);
app.use("/api/historial", historialRouter);
app.use("/api/marcas", marcasRouter);
app.use("/api/prestamos", prestamosRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/tipos-herramienta", tiposHerramientaRouter);
app.use("/api/usuarios", usuariosRouter); 

// ── Ruta raíz (health-check) ──────────────────────────────────────────────────
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Almacen API funcionando 🚀" });
});

// ── Manejo de rutas no encontradas ────────────────────────────────────────────
app.use(notFound);

// ── Manejo global de errores ──────────────────────────────────────────────────
app.use(errorHandler);

// ── Arrancar servidor ─────────────────────────────────────────────────────────
app.listen(env.port, () => {
    console.log(`Servidor corriendo en http://localhost:${env.port}`);
});
