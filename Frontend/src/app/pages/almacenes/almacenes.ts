import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenesService, Almacen, AlmacenCreacionDto } from '../../services/almacenes.service';

@Component({
  selector: 'app-almacenes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './almacenes.html',
  styleUrl: './almacenes.scss',
})
export class Almacenes implements OnInit {
  form!: FormGroup;
  almacenes: Almacen[] = [];
  editingAlmacenId: number | null = null;
  editingAlmacen: Almacen | null = null;
  loading = false;
  loadingInitial = true;
  error: string | null = null;
  successMessage: string | null = null;
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  showDeleteConfirmModal = false;
  almacenToDelete: Almacen | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly almacenesService: AlmacenesService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadAlmacenes();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      telefono: ['', [Validators.minLength(7), Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(500)]],
    });
  }

  private loadAlmacenes(): void {
    this.loadingInitial = true;
    this.almacenesService.getAlmacenes().subscribe({
      next: (data) => {
        this.almacenes = data;
        this.loadingInitial = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading almacenes:', err);
        this.error = 'Error al cargar los almacenes';
        this.loadingInitial = false;
        this.cdr.detectChanges();
      },
    });
  }

  openModal(mode: 'add' | 'edit', almacen?: Almacen): void {
    this.modalMode = mode;
    this.isModalOpen = true;

    if (mode === 'edit' && almacen) {
      this.editingAlmacenId = almacen.id;
      this.editingAlmacen = almacen;
      this.form.patchValue({
        nombre: almacen.nombre,
        telefono: almacen.telefono || '',
        direccion: almacen.direccion || '',
      });
    } else {
      this.editingAlmacenId = null;
      this.editingAlmacen = null;
      this.form.reset();
    }

    this.error = null;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingAlmacenId = null;
    this.editingAlmacen = null;
    this.form.reset();
    this.error = null;
    this.cdr.detectChanges();
  }

  startEdit(almacen: Almacen): void {
    this.openModal('edit', almacen);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData: AlmacenCreacionDto = {
      nombre: this.form.get('nombre')?.value.trim(),
      telefono: this.form.get('telefono')?.value.trim() || null,
      direccion: this.form.get('direccion')?.value.trim() || null,
    };

    const request = this.editingAlmacenId
      ? this.almacenesService.updateAlmacen(this.editingAlmacenId, formData)
      : this.almacenesService.createAlmacen(formData);

    request.subscribe({
      next: (response) => {
        if (this.editingAlmacenId) {
          const index = this.almacenes.findIndex((a) => a.id === this.editingAlmacenId);
          if (index !== -1) {
            this.almacenes[index] = response;
          }
          this.successMessage = 'Almacén actualizado correctamente';
        } else {
          this.almacenes.push(response);
          this.successMessage = 'Almacén creado correctamente';
        }

        this.loading = false;
        this.closeModal();
        this.clearMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = err.error?.mensaje || 'Error al guardar el almacén';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openDeleteConfirmModal(almacen: Almacen): void {
    this.almacenToDelete = almacen;
    this.showDeleteConfirmModal = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirmModal = false;
    this.almacenToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.almacenToDelete) return;

    this.loading = true;
    this.almacenesService.deleteAlmacen(this.almacenToDelete.id).subscribe({
      next: () => {
        this.almacenes = this.almacenes.filter((a) => a.id !== this.almacenToDelete?.id);
        this.successMessage = 'Almacén eliminado correctamente';
        this.loading = false;
        this.showDeleteConfirmModal = false;
        this.almacenToDelete = null;
        this.clearMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        
        // Verificar si es error 409 (Conflict - almacén en uso)
        if (err.status === 409) {
          this.error = err.error?.mensaje || 'No se puede eliminar un almacén que contiene herramientas';
        } else {
          this.error = 'Error al eliminar el almacén';
        }
        
        this.loading = false;
        this.showDeleteConfirmModal = false;
        this.almacenToDelete = null;
        this.cdr.detectChanges();
      },
    });
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.error = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}
