// ─── Service para Prestamos ───────────────────────────────────────────────────
import { ZodError } from "zod";
import * as dto from "./prestamos.dto.js";
import * as mapper from "./prestamos.mapper.js";
import * as repo from "./prestamos.repository.js";

function zodToHttpError(zodErr) {
  const err = new Error("Datos inválidos");
  err.status = 400;
  const issues = zodErr.issues ?? zodErr.errors ?? [];
  err.detalles = issues.map((e) => `${e.path.join(".")}: ${e.message}`);
  return err;
}

async function validarRelaciones(data, excludePrestamoId = null) {
  if (data.id_usuario !== undefined && data.id_usuario !== null) {
    const usuarioExiste = await repo.existsUsuario(data.id_usuario);
    if (!usuarioExiste) {
      const err = new Error("El usuario indicado no existe");
      err.status = 400;
      throw err;
    }
  }

  if (data.id_herramienta !== undefined && data.id_herramienta !== null) {
    const herramientaExiste = await repo.existsHerramienta(data.id_herramienta);
    if (!herramientaExiste) {
      const err = new Error("La herramienta indicada no existe");
      err.status = 400;
      throw err;
    }

    // Evita dos préstamos activos para la misma herramienta.
    const estadoNormalizado = String(data.estado ?? "activo").toLowerCase();
    const seraActivo = !data.fecha_devolucion_real && estadoNormalizado !== "devuelto";
    if (seraActivo) {
      const activo = await repo.existsPrestamoActivoByHerramienta(
        data.id_herramienta,
        excludePrestamoId
      );
      if (activo) {
        const err = new Error("La herramienta ya tiene un préstamo activo");
        err.status = 409;
        throw err;
      }
    }
  }
}

function estaDevuelto(data) {
  const estado = data.estado ? String(data.estado).toLowerCase() : null;
  return estado === "devuelto" || data.fecha_devolucion_real !== undefined && data.fecha_devolucion_real !== null;
}

export async function getAll(rawFilters = {}) {
  let filters;
  try {
    filters = dto.validarFiltros(rawFilters);
  } catch (e) {
    if (e instanceof ZodError) throw zodToHttpError(e);
    throw e;
  }

  const prestamos = await repo.findAll(filters);
  return mapper.toPrestamoDtoList(prestamos);
}

export async function getById(id) {
  const prestamo = await repo.findById(id);
  if (!prestamo) return null;
  return mapper.toPrestamoDto(prestamo);
}

export async function create(rawDto) {
  let parsed;
  try {
    parsed = dto.validarCreacion(rawDto);
  } catch (e) {
    if (e instanceof ZodError) throw zodToHttpError(e);
    throw e;
  }

  await validarRelaciones(parsed);

  const data = mapper.fromCreacionDto(parsed);
  const creado = await repo.create(data);

  // Si nace como préstamo activo, marcamos herramienta como no disponible.
  if (!estaDevuelto(parsed) && parsed.id_herramienta) {
    await repo.updateHerramientaDisponibilidad(parsed.id_herramienta, false);
  }

  return mapper.toPrestamoDto(creado);
}

export async function update(id, rawDto) {
  const existente = await repo.findById(id);
  if (!existente) return null;

  let parsed;
  try {
    parsed = dto.validarModificacion(rawDto);
  } catch (e) {
    if (e instanceof ZodError) throw zodToHttpError(e);
    throw e;
  }

  const propuesto = {
    id_usuario: parsed.id_usuario ?? existente.id_usuario ?? undefined,
    id_herramienta: parsed.id_herramienta ?? existente.id_herramienta ?? undefined,
    estado: parsed.estado ?? existente.estado ?? undefined,
    fecha_devolucion_real:
      parsed.fecha_devolucion_real !== undefined
        ? parsed.fecha_devolucion_real
        : existente.fecha_devolucion_real?.toISOString(),
  };

  await validarRelaciones(propuesto, id);

  const data = mapper.fromModificacionDto(parsed);
  const actualizado = await repo.update(id, data);

  const herramientaId = actualizado.id_herramienta;
  if (herramientaId) {
    // Si el préstamo está devuelto, la herramienta queda disponible.
    // Si sigue activo, se mantiene no disponible.
    await repo.updateHerramientaDisponibilidad(herramientaId, estaDevuelto(actualizado));
  }

  return mapper.toPrestamoDto(actualizado);
}

export async function remove(id) {
  const existente = await repo.findById(id);
  if (!existente) return false;

  await repo.remove(id);

  // Si borramos un préstamo activo, liberamos la herramienta.
  if (existente.id_herramienta && !estaDevuelto(existente)) {
    await repo.updateHerramientaDisponibilidad(existente.id_herramienta, true);
  }

  return true;
}
