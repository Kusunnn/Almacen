import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiTool, ToolsService } from '../../services/tools.service';
import { PrestamosService, Prestamo } from '../../services/prestamos.service';
import { ToolUnit } from '../../models/tool.model';
import { AddToolComponent } from '../../components/add-tool/add-tool.component';

@Component({
  selector: 'app-herramientas',
  imports: [CommonModule, AddToolComponent],
  standalone: true,
  templateUrl: './herramientas.html',
  styleUrls: ['./herramientas.scss'],
})
export class Herramientas implements OnInit {
  tools: ToolUnit[] = [];
  // mapa toolId -> cantidad reservada actualmente (suma de prestamos activos)
  reservedMap: Record<number, number> = {};
  totalCount: number = 0;
  availableCount: number = 0;
  lowStockCount: number = 0;
  searchText: string = '';
  loading = true;
  error = '';

  isAddToolModalOpen = false;
  selectedTool: ApiTool | null = null;
  selectedToolError = '';
  selectedToolLoading = false;

  constructor(
    private readonly toolsService: ToolsService,
    private readonly prestamosService: PrestamosService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  private isToolAvailable(tool: ToolUnit): boolean {
    return tool.status !== 'maintenance' && this.getAvailableForTool(tool) > 0;
  }

  private getReservedForTool(toolId: number): number {
    return this.getReservedCount(toolId);
  }

  ngOnInit() {
    this.loadTools();
  }

  private loadTools() {
    this.loading = true;
    this.error = '';

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
          // después de cargar herramientas, cargar prestamos para calcular reservados
          this.prestamosService.getPrestamos().subscribe({
            next: (prestamos) => {
              this.computeReservedMap(prestamos);
              this.updateStats();
              this.cdr.detectChanges();
            },
            error: () => {
              // si falla la carga de prestamos, igual actualizamos stats con datos disponibles
              this.updateStats();
              this.cdr.detectChanges();
            },
          });
        },
        error: () => {
          this.error = 'No se pudieron cargar las herramientas';
        },
      });
  }

  private computeReservedMap(prestamos: Prestamo[]) {
    this.reservedMap = {};
    for (const p of prestamos) {
      // considerar préstamos activos o no devueltos como reservados
      if (p.estado && p.estado.toLowerCase() === 'devuelto') continue;
      const toolId = p.id_herramienta;
      const qty = p.cantidad ?? 1;
      this.reservedMap[toolId] = (this.reservedMap[toolId] || 0) + qty;
    }
  }

  getReservedCount(toolId: number): number {
    return this.reservedMap[toolId] || 0;
  }

  getAvailableForTool(tool: ToolUnit): number {
    if (tool.status === 'maintenance') {
      return 0;
    }

    const total = tool.cantidad ?? 0;
    const reserved = this.getReservedForTool(tool.id);
    return Math.max(total - reserved, 0);
  }

  updateStats() {
    this.totalCount = this.toolsService.getTotalCount(this.tools);
    this.availableCount = this.tools.filter((tool) => this.isToolAvailable(tool)).length;
    this.lowStockCount = this.tools.filter(
      (tool) => tool.status !== 'maintenance' && this.getAvailableForTool(tool) <= 0
    ).length;
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

  getToolStatusLabel(tool: ToolUnit): string {
    if (tool.status === 'maintenance') {
      return 'Mantenimiento';
    }

    return this.isToolAvailable(tool) ? 'Disponible' : 'Reservada';
  }

  getToolStatusClass(tool: ToolUnit): string {
    if (tool.status === 'maintenance') {
      return 'availability--low';
    }

    return this.isToolAvailable(tool) ? 'availability--high' : 'availability--medium';
  }

  canReserveTool(tool: ToolUnit): boolean {
    return this.getAvailableForTool(tool) > 0;
  }

  goToPrestamos(): void {
    this.router.navigate(['/prestamos']);
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

  openAddToolModal() {
    this.selectedTool = null;
    this.isAddToolModalOpen = true;
  }

  openEditToolModal(toolId: number) {
    this.selectedToolLoading = true;
    this.selectedToolError = '';

    this.toolsService.getTool(toolId).pipe(
      finalize(() => {
        this.selectedToolLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (tool) => {
        this.selectedTool = tool;
      },
      error: () => {
        this.selectedToolError = 'No se pudo cargar la herramienta para editar';
      },
    });
  }

  closeAddToolModal() {
    this.isAddToolModalOpen = false;
    this.selectedTool = null;
    this.selectedToolLoading = false;
    this.selectedToolError = '';
  }

  onToolCreated() {
    this.loadTools();
  }

  onToolSaved() {
    this.loadTools();
  }

  onToolDeleted() {
    this.loadTools();
  }
}
