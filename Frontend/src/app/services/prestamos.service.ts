import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';

interface ApiListResponse<T> {
  value: T;
  Count?: number;
}

export interface Prestamo {
  id: number;
  id_usuario: number;
  id_herramienta: number;
  cantidad?: number | null;
  fecha_prestamo: string;
  fecha_devolucion_estimada: string | null;
  fecha_devolucion_real: string | null;
  estado: string | null;
  observaciones: string | null;
  usuario?: {
    id: number;
    nombre: string;
    correo: string | null;
  };
  herramienta?: {
    id: number;
    nombre: string;
    estado: string | null;
    disponibilidad: boolean | null;
  };
}

export interface PrestamoCreacionDto {
  id_usuario: number;
  id_herramienta: number;
  cantidad?: number | null;
  fecha_prestamo?: string;
  fecha_devolucion_estimada?: string | null;
  fecha_devolucion_real?: string | null;
  estado?: string | null;
  observaciones?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PrestamosService {
  private readonly http = inject(HttpClient);

  getPrestamos(filtros?: { id_usuario?: number; id_herramienta?: number; estado?: string }): Observable<Prestamo[]> {
    let params = new HttpParams();
    if (filtros?.id_usuario) params = params.set('id_usuario', filtros.id_usuario);
    if (filtros?.id_herramienta) params = params.set('id_herramienta', filtros.id_herramienta);
    if (filtros?.estado) params = params.set('estado', filtros.estado);

    return this.http.get<Prestamo[] | ApiListResponse<Prestamo[]>>(`${API_BASE_URL}/prestamos`, { params }).pipe(
      timeout(5000),
      map((response) => (Array.isArray(response) ? response : response.value ?? []))
    );
  }

  getPrestamoById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${API_BASE_URL}/prestamos/${id}`).pipe(timeout(5000));
  }

  createPrestamo(dto: PrestamoCreacionDto): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${API_BASE_URL}/prestamos`, dto).pipe(timeout(5000));
  }

  updatePrestamo(id: number, dto: Partial<PrestamoCreacionDto>): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${API_BASE_URL}/prestamos/${id}`, dto).pipe(timeout(5000));
  }

  deletePrestamo(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${API_BASE_URL}/prestamos/${id}`).pipe(timeout(5000));
  }
}
