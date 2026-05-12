import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrestamosService, Prestamo, PrestamoCreacionDto } from '../../services/prestamos.service';
import { HistorialService } from '../../services/historial.service';
import { ToolsService } from '../../services/tools.service';
import { UsersService } from '../../services/users.service';
import { ToolUnit } from '../../models/tool.model';
import { AuthUser } from '../../models/auth.model';

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
  searchText: string = '';
  usuarios: AuthUser[] = [];
  todasHerramientas: ToolUnit[] = [];
  herramientasDisponibles: ToolUnit[] = [];
  herramientasFormulario: ToolUnit[] = [];
  usuariosFormulario: AuthUser[] = [];
  usuariosFiltrados: AuthUser[] = [];
  herramientasFiltradas: ToolUnit[] = [];
  editingPrestamoId: number | null = null;
  editingPrestamo: Prestamo | null = null;
  loading = false;
  loadingInitial = true;
  error: string | null = null;
  successMessage: string | null = null;
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  showFinalizarConfirmModal = false;
  prestamoToFinalize: Prestamo | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly prestamosService: PrestamosService,
    private readonly historialService: HistorialService,
    private readonly toolsService: ToolsService,
    private readonly usersService: UsersService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadPrestamos();
    this.loadHerramientas();
    this.loadUsuarios();
    this.setupCantidadValidation();
  }

  private setupCantidadValidation(): void {
    this.form.get('id_herramienta')?.valueChanges.subscribe((toolId) => {
      this.updateCantidadValidation(toolId);
    });
  }

  private updateCantidadValidation(toolId: string | number | null | undefined): void {
    const cantidadControl = this.form.get('cantidad');
    if (!cantidadControl) {
      return;
    }

    const maxCantidad = this.getMaxCantidadForTool(toolId);
    const validators = [Validators.required, Validators.min(1)];

    if (maxCantidad > 0) {
      validators.push(Validators.max(maxCantidad));
    }

    cantidadControl.setValidators(validators);
    cantidadControl.updateValueAndValidity({ emitEvent: false });
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
        this.todasHerramientas = tools;
        this.herramientasDisponibles = tools.filter((t) => t.status === 'available');
        this.refreshHerramientasFormulario();
        this.herramientasFiltradas = this.herramientasFormulario;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading tools:', err),
    });
  }

  private loadUsuarios(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.usuariosFormulario = users;
        this.usuariosFiltrados = users;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  openModal(mode: 'add' | 'edit' = 'add'): void {
    this.modalMode = mode;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.clearEditState();
  }

  startEdit(prestamo: Prestamo): void {
    this.editingPrestamoId = prestamo.id;
    this.editingPrestamo = prestamo;
    this.modalMode = 'edit';
    this.isModalOpen = true;
    this.refreshHerramientasFormulario();
    this.form.patchValue({
      id_usuario: prestamo.id_usuario,
      id_herramienta: prestamo.id_herramienta,
      cantidad: prestamo.cantidad ?? 1,
      fecha_devolucion_estimada: prestamo.fecha_devolucion_estimada ? prestamo.fecha_devolucion_estimada.substring(0, 16) : '',
      estado: prestamo.estado ?? 'activo',
      observaciones: prestamo.observaciones ?? '',
    });
    this.updateCantidadValidation(prestamo.id_herramienta);
    this.cdr.detectChanges();
  }

  private clearEditState(): void {
    this.editingPrestamoId = null;
    this.editingPrestamo = null;
    this.form.reset({
      cantidad: 1,
      estado: 'activo',
    });
    this.refreshHerramientasFormulario();
  }

  private refreshHerramientasFormulario(): void {
    const herramientas = [...this.herramientasDisponibles];

    if (this.editingPrestamo?.herramienta) {
      const currentToolId = this.editingPrestamo.herramienta.id;
      const currentTool = this.todasHerramientas.find((tool) => tool.id === currentToolId);
      const alreadyIncluded = herramientas.some((tool) => tool.id === currentToolId);

      if (!alreadyIncluded && currentTool) {
        herramientas.unshift(currentTool);
      }
    }

    this.herramientasFormulario = herramientas;
    this.herramientasFiltradas = herramientas;
  }

  getUsuarioDisplay(userId: number): string {
    const usuario = this.usuariosFormulario.find((u) => u.id === userId);
    return usuario ? `${usuario.nombre} (${usuario.correo || 'Sin email'})` : '';
  }

  getHerramientaDisplay(toolId: number): string {
    const herramienta = this.herramientasFormulario.find((h) => h.id === toolId);
    return herramienta ? `${herramienta.modelName} (${herramienta.toolTypeName})` : '';
  }

  private getMaxCantidadForTool(toolId: string | number | null | undefined): number {
    if (!toolId) {
      return 0;
    }

    const numericToolId = Number(toolId);
    const selectedTool = this.todasHerramientas.find((tool) => tool.id === numericToolId);

    if (!selectedTool) {
      return 0;
    }

    const baseCantidad = selectedTool.cantidad ?? 0;
    return baseCantidad;
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
    return this.getMaxCantidadForTool(toolId);
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
          this.successMessage = 'Préstamo actualizado.';
          this.form.reset({ cantidad: 1, estado: 'activo' });
          this.isModalOpen = false;
          this.clearEditState();
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
              this.successMessage = `Préstamo registrado exitosamente. Historial actualizado.`;
              this.form.reset({ cantidad: 1, estado: 'activo' });
              this.isModalOpen = false;
              this.clearEditState();
              this.loadPrestamos();
              this.loadHerramientas();
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error creating historial:', err);
              this.successMessage = `Préstamo creado, pero hubo un error al registrar en historial.`;
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

  openFinalizarConfirmModal(prestamo: Prestamo): void {
    this.prestamoToFinalize = prestamo;
    this.showFinalizarConfirmModal = true;
    this.cdr.detectChanges();
  }

  cancelFinalize(): void {
    this.showFinalizarConfirmModal = false;
    this.prestamoToFinalize = null;
    this.cdr.detectChanges();
  }

  confirmFinalize(): void {
    if (!this.prestamoToFinalize) return;

    this.loading = true;
    const now = new Date().toISOString();
    const patch: Partial<Prestamo> = {
      fecha_devolucion_real: now,
      estado: 'devuelto',
    };

    this.prestamosService.updatePrestamo(this.prestamoToFinalize.id, patch).subscribe({
      next: () => {
        this.successMessage = 'Préstamo finalizado correctamente.';
        this.loading = false;
        this.showFinalizarConfirmModal = false;
        this.prestamoToFinalize = null;
        this.loadPrestamos();
        this.loadHerramientas();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error finalizing prestamo:', err);
        this.error = 'Error al finalizar el préstamo.';
        this.loading = false;
        this.showFinalizarConfirmModal = false;
        this.prestamoToFinalize = null;
        this.cdr.detectChanges();
      },
    });
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }

  private isVencido(prestamo: Prestamo): boolean {
    if (!prestamo.fecha_devolucion_estimada || prestamo.estado?.toLowerCase() === 'devuelto') {
      return false;
    }
    const now = new Date();
    const estimatedDate = new Date(prestamo.fecha_devolucion_estimada);
    return estimatedDate < now;
  }

  private getSortOrder(prestamo: Prestamo): number {
    if (this.isVencido(prestamo)) return 0; // vencidos primero
    if (prestamo.estado?.toLowerCase() === 'activo') return 1; // activos después
    return 2; // devueltos al final
  }

  getEstadoDisplay(prestamo: Prestamo): string {
    if (this.isVencido(prestamo)) {
      return 'vencido';
    }
    return prestamo.estado?.toLowerCase() || 'desconocido';
  }

  getEstadoText(prestamo: Prestamo): string {
    if (this.isVencido(prestamo)) {
      return 'Vencido';
    }
    const estado = prestamo.estado?.toLowerCase();
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'devuelto':
        return 'Devuelto';
      default:
        return prestamo.estado || 'Sin estado';
    }
  }

  filteredPrestamos(): Prestamo[] {
    let result = this.prestamos;

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      result = result.filter(
        (prestamo) =>
          (prestamo.herramienta?.nombre && prestamo.herramienta.nombre.toLowerCase().includes(search)) ||
          (prestamo.usuario?.nombre && prestamo.usuario.nombre.toLowerCase().includes(search)) ||
          (prestamo.usuario?.correo && prestamo.usuario.correo.toLowerCase().includes(search)) ||
          (prestamo.estado && prestamo.estado.toLowerCase().includes(search)) ||
          (this.isVencido(prestamo) && 'vencido'.includes(search))
      );
    }

    return result.sort((a, b) => this.getSortOrder(a) - this.getSortOrder(b));
  }

  onSearch(event: any): void {
    this.searchText = event.target.value;
  }
}
