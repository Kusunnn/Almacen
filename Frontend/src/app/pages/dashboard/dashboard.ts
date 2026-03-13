import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  constructor(private readonly authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
