import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { ToolUnit } from '../models/tool.model';
import { API_BASE_URL } from './api.config';

export interface ApiTool {
  id: number;
  nombre: string;
  descripcion: string | null;
  id_tipo: number | null;
  id_marca: number | null;
  marca_nombre?: string | null;
  tipo_nombre?: string | null;
  estado: string | null;
  fecha_ingreso: string | null;
  disponibilidad: boolean | null;
  id_almacen: number | null;
  foto_herramienta: string | null;
  cantidad?: number | null;
}

export interface ToolType {
  id: number;
  nombre: string;
}

export interface Brand {
  id: number;
  nombre: string;
}

export interface Warehouse {
  id: number;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export interface CreateToolRequest {
  nombre: string;
  descripcion?: string | null;
  id_tipo?: number | null;
  id_marca?: number | null;
  estado?: string | null;
  fecha_ingreso?: string | null;
  disponibilidad?: boolean | null;
  id_almacen?: number | null;
  foto_herramienta?: string | null;
  cantidad?: number | null;
}

export type UpdateToolRequest = CreateToolRequest;

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  private readonly http = inject(HttpClient);

  // ─── Herramientas ─────────────────────────────────────────────────────────

  getAllUnits(): Observable<ToolUnit[]> {
    return this.http.get<ApiTool[]>(`${API_BASE_URL}/herramientas`).pipe(
      timeout(5000),
      map((tools) => tools.map((tool) => this.mapTool(tool)))
    );
  }

  createTool(data: CreateToolRequest): Observable<ApiTool> {
    return this.http.post<ApiTool>(`${API_BASE_URL}/herramientas`, data).pipe(
      timeout(5000)
    );
  }

  getTool(id: number): Observable<ApiTool> {
    return this.http.get<ApiTool>(`${API_BASE_URL}/herramientas/${id}`).pipe(timeout(5000));
  }

  updateTool(id: number, data: UpdateToolRequest): Observable<ApiTool> {
    return this.http.put<ApiTool>(`${API_BASE_URL}/herramientas/${id}`, data).pipe(timeout(5000));
  }

  deleteTool(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/herramientas/${id}`).pipe(timeout(5000));
  }

  // ─── Catálogos ────────────────────────────────────────────────────────────

  getToolTypes(): Observable<ToolType[]> {
    return this.http.get<ToolType[]>(`${API_BASE_URL}/tipos-herramienta`).pipe(
      timeout(5000)
    );
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${API_BASE_URL}/marcas`).pipe(
      timeout(5000)
    );
  }

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${API_BASE_URL}/almacenes`).pipe(
      timeout(5000)
    );
  }

  // ─── Estadísticas ────────────────────────────────────────────────────────

  getTotalCount(tools: ToolUnit[]): number {
    return tools.length;
  }

  getAvailableCount(tools: ToolUnit[]): number {
    return tools.filter((tool) => tool.status === 'available').length;
  }

  getLowStockCount(tools: ToolUnit[]): number {
    return tools.filter((tool) => tool.status !== 'available').length;
  }

  // ─── Mapeos internos ──────────────────────────────────────────────────────

  private mapTool(tool: ApiTool): ToolUnit {
    return {
      id: tool.id,
      unitId: `HR-${String(tool.id).padStart(3, '0')}`,
      toolTypeName: tool.tipo_nombre ?? 'Sin tipo',
      brandName: tool.marca_nombre ?? 'Sin marca',
      modelName: tool.nombre,
      modelCode: `HM-${String(tool.id).padStart(4, '0')}`,
      status: this.mapStatus(tool),
      location: tool.id_almacen ? `Almacén ${tool.id_almacen}` : 'Sin almacén',
      imageUrl: tool.foto_herramienta,
      description: tool.descripcion,
    };
  }

  private mapStatus(tool: ApiTool): ToolUnit['status'] {
    const estado = tool.estado?.toLowerCase();

    if (tool.disponibilidad === false) {
      return 'reserved';
    }

    if (estado === 'mantenimiento') {
      return 'maintenance';
    }

    return 'available';
  }
}
