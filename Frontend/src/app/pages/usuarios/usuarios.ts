import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserTool {
  brand: string;
  name: string;
  id: string;
  date: string;
  status: 'disponible' | 'reservada' | 'mantenimiento';
}

interface User {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  location: string;
  tools: UserTool[];
}

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss'],
})
export class Usuarios {
  currentUser: User = {
    id: 'USR-001',
    name: 'Juan Manuel Pérez',
    role: 'Técnico de Obra - Obra Actual',
    employeeId: 'WM-729',
    location: 'Obra Insurgente - Sección A',
    tools: [
      {
        brand: 'DeWalt',
        name: 'Taladro Percutor',
        id: 'AX-101',
        date: '15/10/2023',
        status: 'disponible',
      },
      {
        brand: 'Bosch',
        name: 'Sierra Circular Makita',
        id: 'SC-203',
        date: '14/10/2023',
        status: 'disponible',
      },
      {
        brand: 'Stanley',
        name: 'Juego de Dados Stanley',
        id: 'JD-05',
        date: '14/10/2023',
        status: 'reservada',
      },
    ],
  };

  getStatusLabel(status: string): string {
    switch (status) {
      case 'disponible':
        return 'En Uso';
      case 'reservada':
        return 'Próxima a Devolverse';
      case 'mantenimiento':
        return 'Mantenimiento';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'disponible':
        return 'status--available';
      case 'reservada':
        return 'status--reserved';
      case 'mantenimiento':
        return 'status--maintenance';
      default:
        return '';
    }
  }
}
