import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import authRouter from "./modules/Usuarios/usuarios.routes.js";

const app = express();

app.disable("etag");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/api/auth", authRouter);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Auth Service funcionando" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Auth Service corriendo en http://localhost:${env.port}`);
});
