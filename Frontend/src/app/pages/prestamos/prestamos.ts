import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrestamosService, Prestamo, PrestamoCreacionDto } from '../../services/prestamos.service';
import { HistorialService } from '../../services/historial.service';
import { ToolsService } from '../../services/tools.service';
import { ToolUnit } from '../../models/tool.model';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.scss',
})
export class Prestamos implements OnInit {
  form!: FormGroup;
  prestamos: Prestamo[] = [];
  herramientasDisponibles: ToolUnit[] = [];
  editingPrestamoId: number | null = null;
  loading = false;
  loadingInitial = true;
  error: string | null = null;
  successMessage: string | null = null;
  showForm = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly prestamosService: PrestamosService,
    private readonly historialService: HistorialService,
    private readonly toolsService: ToolsService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadPrestamos();
    this.loadHerramientas();
    this.setupCantidadValidation();
  }

  private setupCantidadValidation(): void {
    this.form.get('id_herramienta')?.valueChanges.subscribe((toolId) => {
      if (toolId) {
        const selectedTool = this.herramientasDisponibles.find((t) => t.id === parseInt(toolId, 10));
        const cantidadControl = this.form.get('cantidad');
        if (cantidadControl && selectedTool && selectedTool.cantidad) {
          cantidadControl.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(selectedTool.cantidad),
          ]);
          cantidadControl.updateValueAndValidity();
        }
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id_usuario: ['', [Validators.required]],
      id_herramienta: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      fecha_devolucion_estimada: ['', [Validators.required]],
      estado: ['activo', [Validators.required]],
      observaciones: ['', []],
    });
  }

  private loadPrestamos(): void {
    this.loadingInitial = true;
    this.prestamosService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.loadingInitial = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading prestamos:', err);
        this.error = 'Error al cargar los préstamos';
        this.loadingInitial = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadHerramientas(): void {
    this.toolsService.getAllUnits().subscribe({
      next: (tools) => {
        this.herramientasDisponibles = tools.filter((t) => t.status === 'available');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading tools:', err),
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  startEdit(prestamo: Prestamo): void {
    this.editingPrestamoId = prestamo.id;
    this.showForm = true;
    this.form.patchValue({
      id_usuario: prestamo.id_usuario,
      id_herramienta: prestamo.id_herramienta,
      cantidad: prestamo.cantidad ?? 1,
      fecha_devolucion_estimada: prestamo.fecha_devolucion_estimada ? prestamo.fecha_devolucion_estimada.substring(0, 16) : '',
      estado: prestamo.estado ?? 'activo',
      observaciones: prestamo.observaciones ?? '',
    });
    this.cdr.detectChanges();
  }

  private toIsoDateTime(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  }

  getMaxCantidad(): number {
    const toolId = this.form.get('id_herramienta')?.value;
    if (!toolId) {
      return 0;
    }
    const selectedTool = this.herramientasDisponibles.find((t) => t.id === parseInt(toolId, 10));
    return selectedTool?.cantidad || 0;
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    const formValue = this.form.value;

    // Validar que cantidad sea al menos 1
    if (!formValue.cantidad || formValue.cantidad < 1) {
      this.error = 'La cantidad debe ser al menos 1';
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;
    const now = new Date().toISOString();

    const payload = {
      id_usuario: parseInt(formValue.id_usuario, 10),
      id_herramienta: parseInt(formValue.id_herramienta, 10),
      cantidad: formValue.cantidad ? parseInt(formValue.cantidad, 10) : 1,
      fecha_devolucion_estimada: this.toIsoDateTime(formValue.fecha_devolucion_estimada),
      estado: formValue.estado || 'activo',
      observaciones: formValue.observaciones || null,
    };

    if (this.editingPrestamoId) {
      // Update existing
      this.prestamosService.updatePrestamo(this.editingPrestamoId, payload).subscribe({
        next: () => {
          this.successMessage = '✅ Préstamo actualizado.';
          this.form.reset({ estado: 'activo' });
          this.showForm = false;
          this.editingPrestamoId = null;
          this.loadPrestamos();
          this.loadHerramientas();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating prestamo:', err);
          this.error = 'Error al actualizar el préstamo.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
      return;
    }

    // Create new
    const prestamoDto: PrestamoCreacionDto = {
      ...payload,
      fecha_prestamo: now,
      fecha_devolucion_real: null,
    };

    this.prestamosService.createPrestamo(prestamoDto).subscribe({
      next: (prestamo) => {
        // Registrar en historial
        this.historialService
          .createHistorial({
            id_usuario: prestamo.id_usuario,
            id_herramienta: prestamo.id_herramienta,
            fecha_movimiento: now,
          })
          .subscribe({
            next: () => {
              this.successMessage = `✅ Préstamo registrado exitosamente. Historial actualizado.`;
              this.form.reset({ estado: 'activo' });
              this.showForm = false;
              this.loadPrestamos();
              this.loadHerramientas();
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error creating historial:', err);
              this.successMessage = `⚠️ Préstamo creado, pero hubo un error al registrar en historial.`;
              this.loading = false;
              this.cdr.detectChanges();
            },
          });
      },
      error: (err) => {
        console.error('Error creating prestamo:', err);
        this.error = 'Error al registrar el préstamo. Verifica los datos.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  finalizePrestamo(prestamo: Prestamo): void {
    if (!confirm('Confirmar finalización del préstamo?')) return;
    this.loading = true;
    const now = new Date().toISOString();
    const patch: Partial<Prestamo> = {
      fecha_devolucion_real: now,
      estado: 'devuelto',
    };

    this.prestamosService.updatePrestamo(prestamo.id, patch).subscribe({
      next: () => {
        this.successMessage = '✅ Préstamo finalizado.';
        this.loadPrestamos();
        this.loadHerramientas();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error finalizing prestamo:', err);
        this.error = 'Error al finalizar el préstamo.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }
}
