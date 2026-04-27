import { ZodError } from "zod";
import * as dto from "./marcas.dto.js";
import * as mapper from "./marcas.mapper.js";
import * as repo from "./marcas.repository.js";

function httpError(message, status = 500, detalles = undefined) {
  const error = new Error(message);
  error.status = status;
  if (detalles) error.detalles = detalles;
  return error;
}

function zodToHttpError(error) {
  return httpError(
    "Datos inválidos",
    400,
    (error.issues ?? []).map((issue) => `${issue.path.join(".")}: ${issue.message}`)
  );
}

export async function getAll() {
  return mapper.toMarcaDtoList(await repo.findAll());
}

export async function getById(id) {
  const marca = await repo.findById(id);
  return marca ? mapper.toMarcaDto(marca) : null;
}

export async function create(rawDto) {
  let parsed;
  try {
    parsed = dto.validarCreacion(rawDto);
  } catch (error) {
    if (error instanceof ZodError) throw zodToHttpError(error);
    throw error;
  }

  if (await repo.existsByNombre(parsed.nombre)) {
    throw httpError("Ya existe una marca con ese nombre", 409);
  }

  return mapper.toMarcaDto(await repo.create(mapper.fromCreacionDto(parsed)));
}

export async function update(id, rawDto) {
  const actual = await repo.findById(id);
  if (!actual) return null;

  let parsed;
  try {
    parsed = dto.validarModificacion(rawDto);
  } catch (error) {
    if (error instanceof ZodError) throw zodToHttpError(error);
    throw error;
  }

  if (
    parsed.nombre &&
    parsed.nombre.toLowerCase() !== actual.nombre.toLowerCase() &&
    (await repo.existsByNombre(parsed.nombre, id))
  ) {
    throw httpError("Ya existe una marca con ese nombre", 409);
  }

  return mapper.toMarcaDto(await repo.update(id, mapper.fromModificacionDto(parsed)));
}

export async function remove(id) {
  const actual = await repo.findById(id);
  if (!actual) return false;
  await repo.remove(id);
  return true;
}
