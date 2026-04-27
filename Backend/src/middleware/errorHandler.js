export function errorHandler(error, _req, res, _next) {
  console.error("errorHandler:", error);

  if (error?.status) {
    return res.status(error.status).json({
      mensaje: error.message,
      ...(error.detalles ? { detalles: error.detalles } : {}),
    });
  }

  return res.status(500).json({ mensaje: "Error interno del servidor" });
}
