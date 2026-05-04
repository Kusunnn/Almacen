import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarStateService } from './services/sidebar-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FrontEnd');

  protected readonly showSidebar = signal(true);

  constructor(
    private readonly router: Router,
    readonly sidebarState: SidebarStateService
  ) {
    this.updateSidebarVisibility(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateSidebarVisibility(event.urlAfterRedirects);
      });
  }

  private updateSidebarVisibility(url: string): void {
    const hiddenRoutes = ['/login', '/register'];
    const normalizedUrl = url.split('?')[0].split('#')[0];
    const visible = !hiddenRoutes.includes(normalizedUrl);
    this.showSidebar.set(visible);

    if (!visible) {
      this.sidebarState.setCollapsed(false);
    }
  }
}
