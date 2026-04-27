import { ZodError } from "zod";
import * as dto from "./tipos-herramienta.dto.js";
import * as mapper from "./tipos-herramienta.mapper.js";
import * as repo from "./tipos-herramienta.repository.js";

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
  return mapper.toTipoHerramientaDtoList(await repo.findAll());
}

export async function getById(id) {
  const tipo = await repo.findById(id);
  return tipo ? mapper.toTipoHerramientaDto(tipo) : null;
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
    throw httpError("Ya existe un tipo de herramienta con ese nombre", 409);
  }

  return mapper.toTipoHerramientaDto(await repo.create(mapper.fromCreacionDto(parsed)));
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
    throw httpError("Ya existe un tipo de herramienta con ese nombre", 409);
  }

  return mapper.toTipoHerramientaDto(await repo.update(id, mapper.fromModificacionDto(parsed)));
}

export async function remove(id) {
  const actual = await repo.findById(id);
  if (!actual) return false;
  await repo.remove(id);
  return true;
}
