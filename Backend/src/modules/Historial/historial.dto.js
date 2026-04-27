import { z } from "zod";

const fechaIsoDateTime = z.string().datetime({ message: "Debe tener formato ISO datetime" });

const HistorialBaseSchema = z.object({
  id_usuario: z.coerce.number().int().positive().optional().nullable(),
  id_herramienta: z.coerce.number().int().positive().optional().nullable(),
  fecha_movimiento: fechaIsoDateTime.optional().nullable(),
});

export const HistorialCreacionSchema = HistorialBaseSchema;
export const HistorialModificacionSchema = HistorialBaseSchema.partial();
export const HistorialIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export const HistorialFiltroSchema = z.object({
  id_usuario: z.coerce.number().int().positive().optional(),
  id_herramienta: z.coerce.number().int().positive().optional(),
});

export function validarCreacion(data) {
  return HistorialCreacionSchema.parse(data);
}

export function validarModificacion(data) {
  return HistorialModificacionSchema.parse(data);
}

export function validarIdParam(data) {
  return HistorialIdParamSchema.parse(data);
}

export function validarFiltros(data) {
  return HistorialFiltroSchema.parse(data);
}
