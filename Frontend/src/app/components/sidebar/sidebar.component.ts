import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isCollapsed = signal(false);

  constructor(private readonly authService: AuthService) {}

  toggleSidebar(): void {
    this.isCollapsed.update((value) => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}
