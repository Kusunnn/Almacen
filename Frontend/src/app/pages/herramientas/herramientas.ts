import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ToolsService } from '../../services/tools.service';
import { ToolUnit } from '../../models/tool.model';

@Component({
  selector: 'app-herramientas',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './herramientas.html',
  styleUrls: ['./herramientas.scss'],
})
export class Herramientas implements OnInit {
  tools: ToolUnit[] = [];
  totalCount: number = 0;
  availableCount: number = 0;
  lowStockCount: number = 0;
  searchText: string = '';
  loading = true;
  error = '';

  constructor(
    private readonly toolsService: ToolsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.toolsService
      .getAllUnits()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (units) => {
          this.tools = units;
          this.updateStats();
        },
        error: () => {
          this.error = 'No se pudieron cargar las herramientas';
        },
      });
  }

  updateStats() {
    this.totalCount = this.toolsService.getTotalCount(this.tools);
    this.availableCount = this.toolsService.getAvailableCount(this.tools);
    this.lowStockCount = this.toolsService.getLowStockCount(this.tools);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'reserved':
        return 'Reservada';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available':
        return 'availability--high';
      case 'reserved':
        return 'availability--medium';
      case 'maintenance':
        return 'availability--low';
      default:
        return '';
    }
  }

  filteredTools(): ToolUnit[] {
    if (!this.searchText.trim()) {
      return this.tools;
    }
    const search = this.searchText.toLowerCase();
    return this.tools.filter(
      (tool) =>
        tool.modelName.toLowerCase().includes(search) ||
        tool.brandName.toLowerCase().includes(search) ||
        tool.unitId.toLowerCase().includes(search) ||
        tool.toolTypeName.toLowerCase().includes(search)
    );
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
  }
}
