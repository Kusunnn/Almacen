import { z } from "zod";

const nombreSchema = z.string().trim().min(2).max(100);
const edadSchema = z.coerce.number().int().min(0).max(120);
const telefonoSchema = z.string().trim().min(7).max(20);
const direccionSchema = z.string().trim().min(5).max(255);
const correoSchema = z
  .string()
  .trim()
  .email()
  .max(150)
  .transform((v) => v.toLowerCase());
const contrasenaSchema = z.string().min(6).max(255);
const idRolSchema = z.coerce.number().int().positive();
const fotoPerfilSchema = z
  .preprocess((value) => {
    if (typeof value === "string" && value.trim() === "") return null;
    return value;
  }, z
    .string()
    .trim()
    .max(2_100_000, "El campo 'fotoPerfil' es demasiado grande")
    .refine((value) => {
      try {
        const url = new URL(value);

        if (url.protocol === "data:") {
          return /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(value);
        }

        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "El campo 'fotoPerfil' debe ser una URL válida o una imagen en base64")
    .nullable()
    .optional());


// Creacion
export const usuarioCrearDto = z.object({
  nombre: nombreSchema,
  edad: edadSchema,
  telefono: telefonoSchema,
  direccion: direccionSchema,
  correo: correoSchema,
  contrasena: contrasenaSchema,
  idRol: idRolSchema,
  fotoPerfil: fotoPerfilSchema,
});

export const usuarioLoginDto = z.object({
  correo: correoSchema,
  contrasena: contrasenaSchema,
});


// Modificar
export const usuarioActualizarDto = z.object({
  nombre: nombreSchema.optional(),
  edad: edadSchema.optional(),
  telefono: telefonoSchema.optional(),
  direccion: direccionSchema.optional(),
  correo: correoSchema.optional(),
  contrasena: contrasenaSchema.optional(),
  idRol: idRolSchema.optional(),
  fotoPerfil: fotoPerfilSchema,
});


//Validacion para get/put/delete
export const usuarioIdParamDto = z.object({
  id: z.coerce.number().int().positive(),
});


//Filtros adicionales
export const usuarioFiltroDto = z.object({
  correo: z.string().trim().email().max(150).optional(),
  idRol: z.coerce.number().int().positive().optional(),
});


//Elimina
export const usuarioEliminarDto = z.object({
  id: z.coerce.number().int().positive(),
});
