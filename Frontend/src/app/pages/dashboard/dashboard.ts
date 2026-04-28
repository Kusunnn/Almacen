import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ToolsService } from '../../services/tools.service';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../services/api.config';

interface ToolStats {
  total: number;
  available: number;
  unavailable: number;
  borrowed: number;
}

interface HistoryItem {
  id: number;
  tipo: string;
  fecha: string;
  descripcion?: string;
}

interface HistorialStats {
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  userName: string = 'Usuario';
  toolStats: ToolStats = {
    total: 0,
    available: 0,
    unavailable: 0,
    borrowed: 0,
  };
  recentHistory: HistoryItem[] = [];
  historialStats: HistorialStats = { total: 0 };

  constructor(
    private readonly toolsService: ToolsService,
    private readonly http: HttpClient
  ) {
    this.userName = localStorage.getItem('userName') || 'Usuario';
  }

  ngOnInit(): void {
    this.loadToolsStats();
    this.loadHistorial();
  }

  private loadToolsStats(): void {
    this.toolsService.getAllUnits().subscribe({
      next: (tools) => {
        this.toolStats.total = tools.length;
        this.toolStats.available = tools.filter((t) => t.status === 'available').length;
        this.toolStats.unavailable = tools.filter((t) => t.status === 'maintenance').length;
        this.toolStats.borrowed = tools.filter((t) => t.status === 'reserved').length;
      },
      error: (err) => console.error('Error loading tools:', err),
    });
  }

  private loadHistorial(): void {
    this.http.get<any[]>(`${API_BASE_URL}/historial`).subscribe({
      next: (data) => {
        this.recentHistory = data.slice(0, 5).map((item) => ({
          id: item.id,
          tipo: item.tipo_accion || 'Acción',
          fecha: item.fecha || new Date().toISOString(),
          descripcion: item.descripcion,
        }));
        this.historialStats.total = data.length;
      },
      error: (err) => console.error('Error loading history:', err),
    });
  }

  getHistoryIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      'Préstamo': '📤',
      'Devolución': '📥',
      'Ingreso': '➕',
      'Salida': '➖',
      'default': '📝',
    };
    return icons[tipo] || icons['default'];
  }
}
