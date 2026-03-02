// ─── Service para Herramientas ────────────────────────────────────────────────
// Lógica de negocio (equivalente a la lógica en los endpoints del controller C#).

import { ZodError } from "zod";
import * as repo from "./herramientas.repository.js";
import * as mapper from "./herramientas.mapper.js";
import { validarCreacion, validarModificacion } from "./herramientas.dto.js";

/** Convierte un ZodError en un error HTTP con status 400. */
function zodToHttpError(zodErr) {
    const err = new Error("Datos inválidos");
    err.status = 400;
    err.detalles = zodErr.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return err;
}

// ── Obtener todas ─────────────────────────────────────────────────────────────
export async function getAll() {
    const herramientas = await repo.findAll();
    return mapper.toHerramientaDtoList(herramientas);
}

// ── Obtener por id ────────────────────────────────────────────────────────────
export async function getById(id) {
    const herramienta = await repo.findById(id);
    if (!herramienta) return null;
    return mapper.toHerramientaDto(herramienta);
}

// ── Crear ─────────────────────────────────────────────────────────────────────
export async function create(rawDto) {
    // 1. Validar y parsear con Zod (lanza ZodError si falla)
    let dto;
    try {
        dto = validarCreacion(rawDto);
    } catch (e) {
        if (e instanceof ZodError) throw zodToHttpError(e);
        throw e;
    }

    // 2. Verificar nombre duplicado
    const existe = await repo.existsByNombre(dto.nombre);
    if (existe) {
        const err = new Error("Ya existe una herramienta con ese nombre");
        err.status = 409;
        throw err;
    }

    // 3. Persistir
    const data = mapper.fromCreacionDto(dto);
    const creada = await repo.create(data);
    return mapper.toHerramientaDto(creada);
}

// ── Actualizar ────────────────────────────────────────────────────────────────
export async function update(id, rawDto) {
    // 1. Verificar existencia
    const existente = await repo.findById(id);
    if (!existente) return null;

    // 2. Validar y parsear con Zod
    let dto;
    try {
        dto = validarModificacion(rawDto);
    } catch (e) {
        if (e instanceof ZodError) throw zodToHttpError(e);
        throw e;
    }

    // 3. Verificar nombre duplicado (excluyendo el propio registro)
    const nombreCambio =
        existente.nombre.toLowerCase() !== dto.nombre.trim().toLowerCase();
    if (nombreCambio) {
        const existe = await repo.existsByNombre(dto.nombre, id);
        if (existe) {
            const err = new Error("Ya existe una herramienta con ese nombre");
            err.status = 409;
            throw err;
        }
    }

    // 4. Persistir
    const data = mapper.fromModificacionDto(dto);
    const actualizada = await repo.update(id, data);
    return mapper.toHerramientaDto(actualizada);
}

// ── Eliminar ──────────────────────────────────────────────────────────────────
export async function remove(id) {
    const existente = await repo.findById(id);
    if (!existente) return false;
    await repo.remove(id);
    return true;
}
