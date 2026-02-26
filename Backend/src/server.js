import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Prisma } from "@prisma/client";
import usuariosRoutes from "./modules/Usuarios/usuarios.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Ruta simple para comprobar que la API está viva
app.get("/health", (_req, res) => {
  res.json({ ok: true, servicio: "backend", timestamp: new Date().toISOString() });
});

// Módulos
app.use("/api/usuarios", usuariosRoutes);

// 404 para rutas no existentes
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador global de errores
app.use((error, _req, res, _next) => {
  // Error común de Prisma: violación de unique, FK, etc.
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        mensaje: "Conflicto de datos: valor duplicado en un campo único",
        code: error.code,
      });
    }
  }

  console.error(error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
