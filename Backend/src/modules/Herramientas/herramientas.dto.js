// ─── DTOs para Herramientas (Zod) ─────────────────────────────────────────────
import { z } from "zod";

// ── Schema base (campos compartidos por creación y modificación) ───────────────
const HerramientaBaseSchema = z.object({
    nombre: z
        .string({ required_error: "El campo 'nombre' es requerido" })
        .trim()
        .min(2, "El campo 'nombre' debe tener al menos 2 caracteres")
        .max(100, "El campo 'nombre' no puede superar los 100 caracteres"),

    descripcion: z.string().nullable().optional(),

    id_tipo: z
        .number({ invalid_type_error: "El campo 'id_tipo' debe ser un número" })
        .int("El campo 'id_tipo' debe ser un entero")
        .positive()
        .nullable()
        .optional(),

    id_marca: z
        .number({ invalid_type_error: "El campo 'id_marca' debe ser un número" })
        .int("El campo 'id_marca' debe ser un entero")
        .positive()
        .nullable()
        .optional(),

    estado: z
        .string()
        .max(50, "El campo 'estado' no puede superar los 50 caracteres")
        .nullable()
        .optional(),

    fecha_ingreso: z
        .string()
        .date("El campo 'fecha_ingreso' debe tener formato YYYY-MM-DD")
        .nullable()
        .optional(),

    disponibilidad: z
        .boolean({ invalid_type_error: "El campo 'disponibilidad' debe ser un booleano" })
        .nullable()
        .optional(),

    id_almacen: z
        .number({ invalid_type_error: "El campo 'id_almacen' debe ser un número" })
        .int("El campo 'id_almacen' debe ser un entero")
        .positive()
        .nullable()
        .optional(),
});

// ── Schema de creación ────────────────────────────────────────────────────────
export const HerramientaCreacionSchema = HerramientaBaseSchema;

// ── Schema de modificación ────────────────────────────────────────────────────
export const HerramientaModificacionSchema = HerramientaBaseSchema;

// ── Schema de respuesta (DTO de lectura) ──────────────────────────────────────
export const HerramientaDtoSchema = z.object({
    id: z.number().int(),
    nombre: z.string(),
    descripcion: z.string().nullable(),
    id_tipo: z.number().int().nullable(),
    id_marca: z.number().int().nullable(),
    estado: z.string().nullable(),
    fecha_ingreso: z.string().nullable(),   // YYYY-MM-DD
    disponibilidad: z.boolean().nullable(),
    id_almacen: z.number().int().nullable(),
});

// ── Tipos inferidos (para JSDoc / autocomplete) ───────────────────────────────
/** @typedef {z.infer<typeof HerramientaDtoSchema>}           HerramientaDto           */
/** @typedef {z.infer<typeof HerramientaCreacionSchema>}      HerramientaCreacionDto   */
/** @typedef {z.infer<typeof HerramientaModificacionSchema>}  HerramientaModificacionDto */

// ── Helpers de validación usados por el service ───────────────────────────────
/**
 * Parsea y valida un body de creación.
 * Lanza ZodError si hay campos inválidos.
 * @param {unknown} data
 * @returns {HerramientaCreacionDto}
 */
export function validarCreacion(data) {
    return HerramientaCreacionSchema.parse(data);
}

/**
 * Parsea y valida un body de modificación.
 * Lanza ZodError si hay campos inválidos.
 * @param {unknown} data
 * @returns {HerramientaModificacionDto}
 */
export function validarModificacion(data) {
    return HerramientaModificacionSchema.parse(data);
}
