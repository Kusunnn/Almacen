import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  timeout,
} from 'rxjs';
import { AuthUser, LoginResponse } from '../models/auth.model';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'almacen.currentUser';
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.readStoredUser()
  );

  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(correo: string, contrasena: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/usuarios/login`, {
        correo,
        contrasena,
      })
      .pipe(
        timeout(5000),
        tap((response) => this.setSession(response.usuario)),
        map(() => true),
        catchError(() => {
          this.clearSession();
          return of(false);
        })
      );
  }

  logout(): void {
    this.clearSession();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private setSession(user: AuthUser): void {
    this.currentUserSubject.next(user);
    this.writeStoredUser(user);
  }

  private clearSession(): void {
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  private readStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawUser = window.localStorage.getItem(this.storageKey);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private writeStoredUser(user: AuthUser): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}
