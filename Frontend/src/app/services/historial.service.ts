import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface HistorialItem {
  id: number;
  id_usuario: number | null;
  id_herramienta: number | null;
  fecha_movimiento: string | null;
  usuario?: {
    id: number;
    nombre: string;
    correo: string | null;
  };
  herramienta?: {
    id: number;
    nombre: string;
  };
}

export interface HistorialCreacionDto {
  id_usuario?: number | null;
  id_herramienta?: number | null;
  fecha_movimiento?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private readonly http = inject(HttpClient);

  getHistorial(filtros?: { id_usuario?: number; id_herramienta?: number }): Observable<HistorialItem[]> {
    let params = new HttpParams();
    if (filtros?.id_usuario) params = params.set('id_usuario', filtros.id_usuario);
    if (filtros?.id_herramienta) params = params.set('id_herramienta', filtros.id_herramienta);

    return this.http.get<HistorialItem[]>(`${API_BASE_URL}/historial`, { params }).pipe(timeout(5000));
  }

  createHistorial(dto: HistorialCreacionDto): Observable<HistorialItem> {
    return this.http.post<HistorialItem>(`${API_BASE_URL}/historial`, dto).pipe(timeout(5000));
  }
}
