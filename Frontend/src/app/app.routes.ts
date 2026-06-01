import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Herramientas } from './pages/herramientas/herramientas';
import { Usuarios } from './pages/usuarios/usuarios';
import { Prestamos } from './pages/prestamos/prestamos';
import { Almacenes } from './pages/almacenes/almacenes';
import { Marcas } from './pages/marcas/marcas';
import { Register } from './pages/register/register';
import { authGuard, loginRedirectGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginRedirectGuard] },
  { path: 'register', component: Register, canActivate: [loginRedirectGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'herramientas', component: Herramientas, canActivate: [authGuard] },
  { path: 'marcas', component: Marcas, canActivate: [authGuard] },
  { path: 'usuarios', component: Usuarios, canActivate: [authGuard] },
  { path: 'prestamos', component: Prestamos, canActivate: [authGuard] },
  { path: 'almacenes', component: Almacenes, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
