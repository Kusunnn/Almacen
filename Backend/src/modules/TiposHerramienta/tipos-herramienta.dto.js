import { z } from "zod";

const TipoHerramientaBaseSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
});

export const TipoHerramientaCreacionSchema = TipoHerramientaBaseSchema;
export const TipoHerramientaModificacionSchema = TipoHerramientaBaseSchema.partial();
export const TipoHerramientaIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function validarCreacion(data) {
  return TipoHerramientaCreacionSchema.parse(data);
}

export function validarModificacion(data) {
  return TipoHerramientaModificacionSchema.parse(data);
}

export function validarIdParam(data) {
  return TipoHerramientaIdParamSchema.parse(data);
}
