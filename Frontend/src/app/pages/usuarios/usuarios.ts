import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { UserProfileView } from '../../models/user.model';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss'],
})
export class Usuarios implements OnInit {
  currentUser: UserProfileView = {
    id: '',
    name: '',
    role: '',
    employeeId: '',
    location: '',
    tools: [],
  };
  loading = true;
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.loading = false;
      this.error = 'No hay una sesión activa';
      return;
    }

    this.usersService
      .getUserProfile(currentUser.id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (profile) => {
          this.currentUser = profile;
        },
        error: () => {
          this.error = 'No se pudo cargar la información del usuario';
        },
      });
  }

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
