import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private toolsService: ToolsService) {}

  ngOnInit() {
    this.toolsService.getAllUnits().subscribe((units) => {
      this.tools = units;
      this.updateStats();
    });
  }

  updateStats() {
    this.totalCount = this.toolsService.getTotalCount();
    this.availableCount = this.toolsService.getAvailableCount();
    this.lowStockCount = this.toolsService.getLowStockCount();
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
        tool.unitId.toLowerCase().includes(search)
    );
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
  }
}
