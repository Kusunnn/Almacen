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
const fotoPerfilSchema = z.string().trim().url().max(500);


// Creacion
export const usuarioCrearDto = z.object({
  nombre: nombreSchema,
  edad: edadSchema,
  telefono: telefonoSchema,
  direccion: direccionSchema,
  correo: correoSchema,
  contrasena: contrasenaSchema,
  idRol: idRolSchema,
  fotoPerfil: fotoPerfilSchema.optional().nullable(),
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
  fotoPerfil: fotoPerfilSchema.optional().nullable(),
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
