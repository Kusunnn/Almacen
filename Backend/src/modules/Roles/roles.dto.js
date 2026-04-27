import { z } from "zod";

const RolBaseSchema = z.object({
  nombre: z.string().trim().min(2).max(50),
});

export const RolCreacionSchema = RolBaseSchema;
export const RolModificacionSchema = RolBaseSchema.partial();
export const RolIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function validarCreacion(data) {
  return RolCreacionSchema.parse(data);
}

export function validarModificacion(data) {
  return RolModificacionSchema.parse(data);
}

export function validarIdParam(data) {
  return RolIdParamSchema.parse(data);
}
