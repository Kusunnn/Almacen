import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Herramientas } from './pages/herramientas/herramientas';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'herramientas', component: Herramientas },
  { path: '**', redirectTo: 'dashboard' }
 
];
