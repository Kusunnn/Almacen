import { z } from "zod";

const MarcaBaseSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
});

export const MarcaCreacionSchema = MarcaBaseSchema;
export const MarcaModificacionSchema = MarcaBaseSchema.partial();
export const MarcaIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function validarCreacion(data) {
  return MarcaCreacionSchema.parse(data);
}

export function validarModificacion(data) {
  return MarcaModificacionSchema.parse(data);
}

export function validarIdParam(data) {
  return MarcaIdParamSchema.parse(data);
}
