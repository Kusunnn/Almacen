import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  credentials = { username: '', password: '' };
  error = '';

  constructor(private router: Router, private auth: AuthService) {}

  /**
   * Attempt to authenticate the local test user. Returns true if
   * successful and navigates to the dashboard; otherwise shows an
   * error message and returns false. This return value is useful for
   * unit tests.
   */
  onSubmit(): boolean {
    const ok = this.auth.login(
      this.credentials.username,
      this.credentials.password
    );
    if (ok) {
      this.error = '';
      this.router.navigate(['/dashboard']);
      return true;
    } else {
      this.error = 'Usuario o contraseña inválidos';
      return false;
    }
  }
}
