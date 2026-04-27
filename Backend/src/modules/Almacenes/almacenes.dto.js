import { z } from "zod";

const AlmacenBaseSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  telefono: z.string().trim().min(7).max(20).optional().nullable(),
  direccion: z.string().trim().max(500).optional().nullable(),
});

export const AlmacenCreacionSchema = AlmacenBaseSchema;
export const AlmacenModificacionSchema = AlmacenBaseSchema.partial();
export const AlmacenIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function validarCreacion(data) {
  return AlmacenCreacionSchema.parse(data);
}

export function validarModificacion(data) {
  return AlmacenModificacionSchema.parse(data);
}

export function validarIdParam(data) {
  return AlmacenIdParamSchema.parse(data);
}
