import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { BACKEND_API_URL } from './api.config';

interface ApiListResponse<T> {
  value: T;
  Count?: number;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface MarcaCreacionDto {
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private readonly http = inject(HttpClient);

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[] | ApiListResponse<Marca[]>>(`${BACKEND_API_URL}/marcas`).pipe(
      timeout(5000),
      map((response) => (Array.isArray(response) ? response : response.value ?? []))
    );
  }

  getMarcaById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${BACKEND_API_URL}/marcas/${id}`).pipe(timeout(5000));
  }

  createMarca(dto: MarcaCreacionDto): Observable<Marca> {
    return this.http.post<Marca>(`${BACKEND_API_URL}/marcas`, dto).pipe(timeout(5000));
  }

  updateMarca(id: number, dto: Partial<MarcaCreacionDto>): Observable<Marca> {
    return this.http.put<Marca>(`${BACKEND_API_URL}/marcas/${id}`, dto).pipe(timeout(5000));
  }

  deleteMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${BACKEND_API_URL}/marcas/${id}`).pipe(timeout(5000));
  }
}
