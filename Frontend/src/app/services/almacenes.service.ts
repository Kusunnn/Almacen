import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';

interface ApiListResponse<T> {
  value: T;
  Count?: number;
}

export interface Almacen {
  id: number;
  nombre: string;
  telefono?: string | null;
  direccion?: string | null;
}

export interface AlmacenCreacionDto {
  nombre: string;
  telefono?: string | null;
  direccion?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AlmacenesService {
  private readonly http = inject(HttpClient);

  getAlmacenes(): Observable<Almacen[]> {
    return this.http.get<Almacen[] | ApiListResponse<Almacen[]>>(`${API_BASE_URL}/almacenes`).pipe(
      timeout(5000),
      map((response) => (Array.isArray(response) ? response : response.value ?? []))
    );
  }

  getAlmacenById(id: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${API_BASE_URL}/almacenes/${id}`).pipe(timeout(5000));
  }

  createAlmacen(dto: AlmacenCreacionDto): Observable<Almacen> {
    return this.http.post<Almacen>(`${API_BASE_URL}/almacenes`, dto).pipe(timeout(5000));
  }

  updateAlmacen(id: number, dto: Partial<AlmacenCreacionDto>): Observable<Almacen> {
    return this.http.put<Almacen>(`${API_BASE_URL}/almacenes/${id}`, dto).pipe(timeout(5000));
  }

  deleteAlmacen(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${API_BASE_URL}/almacenes/${id}`).pipe(timeout(5000));
  }
}
