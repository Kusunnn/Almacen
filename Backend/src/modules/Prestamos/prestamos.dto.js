// ─── DTOs para Prestamos (Zod) ────────────────────────────────────────────────
import { z } from "zod";

const fechaIsoDateTime = z
  .string()
  .datetime({ message: "Debe tener formato ISO datetime" });

const PrestamoBaseSchema = z.object({
  id_usuario: z.coerce.number().int().positive(),
  id_herramienta: z.coerce.number().int().positive(),
  fecha_prestamo: fechaIsoDateTime.optional(),
  fecha_devolucion_estimada: fechaIsoDateTime.optional().nullable(),
  fecha_devolucion_real: fechaIsoDateTime.optional().nullable(),
  estado: z.string().trim().min(2).max(50).optional().nullable(),
  observaciones: z.string().trim().max(1000).optional().nullable(),
});

export const PrestamoCreacionSchema = PrestamoBaseSchema;

// En update permitimos cambios parciales.
export const PrestamoModificacionSchema = PrestamoBaseSchema.partial();

export const PrestamoDtoSchema = z.object({
  id: z.number().int(),
  id_usuario: z.number().int().nullable(),
  id_herramienta: z.number().int().nullable(),
  fecha_prestamo: z.string().nullable(),
  fecha_devolucion_estimada: z.string().nullable(),
  fecha_devolucion_real: z.string().nullable(),
  estado: z.string().nullable(),
  observaciones: z.string().nullable(),
  usuario: z
    .object({
      id: z.number().int(),
      nombre: z.string(),
      correo: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  herramienta: z
    .object({
      id: z.number().int(),
      nombre: z.string(),
      estado: z.string().nullable().optional(),
      disponibilidad: z.boolean().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const PrestamoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const PrestamoFiltroSchema = z.object({
  id_usuario: z.coerce.number().int().positive().optional(),
  id_herramienta: z.coerce.number().int().positive().optional(),
  estado: z.string().trim().min(1).max(50).optional(),
});

/** @typedef {z.infer<typeof PrestamoDtoSchema>} PrestamoDto */
/** @typedef {z.infer<typeof PrestamoCreacionSchema>} PrestamoCreacionDto */
/** @typedef {z.infer<typeof PrestamoModificacionSchema>} PrestamoModificacionDto */

export function validarCreacion(data) {
  return PrestamoCreacionSchema.parse(data);
}

export function validarModificacion(data) {
  return PrestamoModificacionSchema.parse(data);
}

export function validarIdParam(data) {
  return PrestamoIdParamSchema.parse(data);
}

export function validarFiltros(data) {
  return PrestamoFiltroSchema.parse(data);
}
