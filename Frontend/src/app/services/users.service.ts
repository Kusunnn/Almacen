import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, timeout } from 'rxjs';
import { AuthUser } from '../models/auth.model';
import { PrestamoUsuario, UserProfileView, UserTool } from '../models/user.model';
import { API_BASE_URL } from './api.config';

interface CreateUserPayload {
  nombre: string;
  edad: number;
  telefono: string;
  direccion: string;
  correo: string;
  contrasena: string;
  idRol: number;
  fotoPerfil: string | null;
}

interface RoleOption {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getRoles(): Observable<RoleOption[]> {
    return this.http
      .get<RoleOption[]>(`${API_BASE_URL}/usuarios/roles`)
      .pipe(timeout(5000));
  }

  register(payload: CreateUserPayload): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${API_BASE_URL}/usuarios`, payload)
      .pipe(timeout(5000));
  }

  getUserProfile(userId: number): Observable<UserProfileView> {
    const prestamosParams = new HttpParams().set('id_usuario', userId);

    return forkJoin({
      usuario: this.http
        .get<AuthUser>(`${API_BASE_URL}/usuarios/${userId}`)
        .pipe(timeout(5000)),
      prestamos: this.http.get<PrestamoUsuario[]>(`${API_BASE_URL}/prestamos`, {
        params: prestamosParams,
      }).pipe(timeout(5000)),
    }).pipe(
      map(({ usuario, prestamos }) => ({
        id: `USR-${String(usuario.id).padStart(3, '0')}`,
        name: usuario.nombre,
        role: usuario.rolNombre ?? 'Sin rol asignado',
        employeeId: `EMP-${String(usuario.id).padStart(3, '0')}`,
        location: usuario.direccion ?? 'Sin ubicación registrada',
        tools: prestamos
          .filter((prestamo) => !this.isReturned(prestamo))
          .map((prestamo) => this.mapTool(prestamo)),
      }))
    );
  }

  private mapTool(prestamo: PrestamoUsuario): UserTool {
    return {
      brand: 'N/D',
      name: prestamo.herramienta?.nombre ?? 'Herramienta sin nombre',
      id: prestamo.herramienta?.id
        ? `HR-${String(prestamo.herramienta.id).padStart(3, '0')}`
        : 'Sin ID',
      date: this.formatDate(prestamo.fecha_prestamo),
      status: this.mapStatus(prestamo.estado),
    };
  }

  private mapStatus(status: string | null): UserTool['status'] {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === 'devuelto') {
      return 'reservada';
    }

    if (normalizedStatus === 'mantenimiento') {
      return 'mantenimiento';
    }

    return 'disponible';
  }

  private formatDate(date: string | null): string {
    if (!date) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  }

  private isReturned(prestamo: PrestamoUsuario): boolean {
    return (
      prestamo.estado?.toLowerCase() === 'devuelto' ||
      prestamo.fecha_devolucion_real !== null
    );
  }
}
