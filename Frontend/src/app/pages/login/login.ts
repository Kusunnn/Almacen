import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  credentials = { correo: '', contrasena: '' };
  error = '';
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.auth
      .login(this.credentials.correo, this.credentials.contrasena)
      .subscribe((ok) => {
        this.loading = false;

        if (ok) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.error = 'Correo o contraseña inválidos';
      });
  }
}
