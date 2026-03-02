import { Injectable } from '@angular/core';
import { ToolType, ToolUnit } from '../models/tool.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  private toolsData: ToolType[] = [
    {
      id: 'martillos',
      name: 'Martillos',
      brands: [
        {
          name: 'DeWalt',
          models: [
            {
              name: 'Plano',
              code: 'DEWALT-M-PLANO-001',
              units: [
                { id: 'UNI-001', status: 'available' },
                { id: 'UNI-002', status: 'available' },
                { id: 'UNI-003', status: 'reserved' },
              ],
            },
            {
              name: 'Curvo',
              code: 'DEWALT-M-CURVO-001',
              units: [
                { id: 'UNI-004', status: 'available' },
                { id: 'UNI-005', status: 'available' },
              ],
            },
          ],
        },
        {
          name: 'Makita',
          models: [
            {
              name: 'Plano',
              code: 'MAKITA-M-PLANO-001',
              units: [
                { id: 'UNI-006', status: 'available' },
                { id: 'UNI-007', status: 'maintenance' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'taladros',
      name: 'Taladros',
      brands: [
        {
          name: 'Bosch',
          models: [
            {
              name: 'Taladro Percutor',
              code: 'BOSCH-T-PERCUTOR-001',
              units: [
                { id: 'UNI-008', status: 'available' },
                { id: 'UNI-009', status: 'available' },
                { id: 'UNI-010', status: 'reserved' },
              ],
            },
          ],
        },
        {
          name: 'Makita',
          models: [
            {
              name: 'Taladro Compacto',
              code: 'MAKITA-T-COMPACTO-001',
              units: [
                { id: 'UNI-011', status: 'available' },
                { id: 'UNI-012', status: 'maintenance' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'desarmadores',
      name: 'Desarmadores',
      brands: [
        {
          name: 'Kingtools',
          models: [
            {
              name: 'Set Phillips',
              code: 'KINGTOOLS-D-PHILLIPS-001',
              units: [
                { id: 'UNI-013', status: 'available' },
                { id: 'UNI-014', status: 'available' },
                { id: 'UNI-015', status: 'available' },
                { id: 'UNI-016', status: 'reserved' },
              ],
            },
            {
              name: 'Set Plano',
              code: 'KINGTOOLS-D-PLANO-001',
              units: [
                { id: 'UNI-017', status: 'available' },
                { id: 'UNI-018', status: 'available' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'escaleras',
      name: 'Escaleras',
      brands: [
        {
          name: 'Werner',
          models: [
            {
              name: 'Escalera de 6 peldaños',
              code: 'WERNER-E-6P-001',
              units: [
                { id: 'UNI-019', status: 'available' },
                { id: 'UNI-020', status: 'available' },
              ],
            },
            {
              name: 'Escalera de 8 peldaños',
              code: 'WERNER-E-8P-001',
              units: [
                { id: 'UNI-021', status: 'reserved' },
                { id: 'UNI-022', status: 'available' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'andamios',
      name: 'Andamios',
      brands: [
        {
          name: 'SafeScaf',
          models: [
            {
              name: 'Andamio Profesional',
              code: 'SAFESCAF-A-PRO-001',
              units: [
                { id: 'UNI-023', status: 'available' },
                { id: 'UNI-024', status: 'maintenance' },
                { id: 'UNI-025', status: 'available' },
              ],
            },
          ],
        },
      ],
    },
  ];

  private allUnits$ = new BehaviorSubject<ToolUnit[]>([]);

  constructor() {
    this.loadAllUnits();
  }

  private loadAllUnits() {
    const units: ToolUnit[] = [];

    this.toolsData.forEach((toolType) => {
      toolType.brands.forEach((brand) => {
        brand.models.forEach((model) => {
          model.units.forEach((unit) => {
            units.push({
              unitId: unit.id,
              toolTypeName: toolType.name,
              brandName: brand.name,
              modelName: model.name,
              modelCode: model.code,
              status: unit.status,
              location: unit.location,
            });
          });
        });
      });
    });

    this.allUnits$.next(units);
  }

  // Obtener todas las unidades de forma plana
  getAllUnits(): Observable<ToolUnit[]> {
    return this.allUnits$.asObservable();
  }

  // Obtener la estructura jerárquica completa
  getToolTypes(): ToolType[] {
    return this.toolsData;
  }

  // Obtener unidades por tipo
  getUnitsByType(typeId: string): ToolUnit[] {
    return this.allUnits$
      .getValue()
      .filter((u) => u.toolTypeName.toLowerCase().includes(typeId.toLowerCase()));
  }

  // Obtener total de unidades
  getTotalCount(): number {
    return this.allUnits$.getValue().length;
  }

  // Obtener unidades disponibles
  getAvailableCount(): number {
    return this.allUnits$.getValue().filter((u) => u.status === 'available').length;
  }

  // Obtener unidades en bajo stock (reservadas + mantenimiento)
  getLowStockCount(): number {
    return this.allUnits$
      .getValue()
      .filter((u) => u.status !== 'available').length;
  }
}
