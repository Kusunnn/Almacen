import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Herramientas } from './pages/herramientas/herramientas';
import { Usuarios } from './pages/usuarios/usuarios';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'herramientas', component: Herramientas },
  { path: 'usuarios', component: Usuarios },
  { path: '**', redirectTo: 'login' },
];
