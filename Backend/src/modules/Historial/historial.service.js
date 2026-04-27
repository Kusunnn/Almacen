import { ZodError } from "zod";
import * as dto from "./historial.dto.js";
import * as mapper from "./historial.mapper.js";
import * as repo from "./historial.repository.js";

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

async function validarRelaciones(data) {
  if (data.id_usuario !== undefined && data.id_usuario !== null) {
    if (!(await repo.existsUsuario(data.id_usuario))) {
      throw httpError("El usuario indicado no existe", 400);
    }
  }

  if (data.id_herramienta !== undefined && data.id_herramienta !== null) {
    if (!(await repo.existsHerramienta(data.id_herramienta))) {
      throw httpError("La herramienta indicada no existe", 400);
    }
  }
}

export async function getAll(rawFilters = {}) {
  let filters;
  try {
    filters = dto.validarFiltros(rawFilters);
  } catch (error) {
    if (error instanceof ZodError) throw zodToHttpError(error);
    throw error;
  }

  return mapper.toHistorialDtoList(await repo.findAll(filters));
}

export async function getById(id) {
  const historial = await repo.findById(id);
  return historial ? mapper.toHistorialDto(historial) : null;
}

export async function create(rawDto) {
  let parsed;
  try {
    parsed = dto.validarCreacion(rawDto);
  } catch (error) {
    if (error instanceof ZodError) throw zodToHttpError(error);
    throw error;
  }

  await validarRelaciones(parsed);
  return mapper.toHistorialDto(await repo.create(mapper.fromCreacionDto(parsed)));
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

  await validarRelaciones(parsed);
  return mapper.toHistorialDto(await repo.update(id, mapper.fromModificacionDto(parsed)));
}

export async function remove(id) {
  const actual = await repo.findById(id);
  if (!actual) return false;
  await repo.remove(id);
  return true;
}
