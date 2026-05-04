import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SidebarStateService } from '../../services/sidebar-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    private readonly authService: AuthService,
    readonly sidebarState: SidebarStateService
  ) {}

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  logout(): void {
    this.authService.logout();
  }
}
