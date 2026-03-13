import express from "express";
import cors from "cors";
import morgan from "morgan";

import herramientasRouter from "./modules/Herramientas/herramientas.routes.js";
import usuariosRouter from "./modules/Usuarios/usuarios.routes.js"; 
import prestamosRouter from "./modules/Prestamos/prestamos.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.disable("etag");

// ── Middleware global ─────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use("/api/herramientas", herramientasRouter);
app.use("/api/usuarios", usuariosRouter); 
app.use("/api/prestamos", prestamosRouter);

// ── Ruta raíz (health-check) ──────────────────────────────────────────────────
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Almacen API funcionando 🚀" });
});

// ── Manejo de rutas no encontradas ────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// ── Arrancar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
