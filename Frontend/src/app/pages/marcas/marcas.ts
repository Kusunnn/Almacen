import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Marca, MarcaCreacionDto, MarcasService } from '../../services/marcas.service';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marcas.html',
  styleUrls: ['./marcas.scss'],
})
export class Marcas implements OnInit {
  marcas: Marca[] = [];
  searchText = '';
  loading = false;
  loadingInitial = true;
  error: string | null = null;
  successMessage: string | null = null;
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  editingMarcaId: number | null = null;
  showDeleteConfirmModal = false;
  marcaToDelete: Marca | null = null;
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly marcasService: MarcasService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.loadMarcas();
  }

  private loadMarcas(): void {
    this.loadingInitial = true;
    this.error = null;

    this.marcasService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
        this.loadingInitial = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading marcas:', err);
        this.error = 'No se pudieron cargar las marcas';
        this.loadingInitial = false;
        this.cdr.detectChanges();
      },
    });
  }

  openModal(mode: 'add' | 'edit', marca?: Marca): void {
    this.modalMode = mode;
    this.isModalOpen = true;
    this.error = null;

    if (mode === 'edit' && marca) {
      this.editingMarcaId = marca.id;
      this.form.patchValue({ nombre: marca.nombre });
    } else {
      this.editingMarcaId = null;
      this.form.reset();
    }

    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingMarcaId = null;
    this.form.reset();
    this.error = null;
    this.cdr.detectChanges();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
  }

  filteredMarcas(): Marca[] {
    if (!this.searchText.trim()) {
      return this.marcas;
    }
    const search = this.searchText.toLowerCase();
    return this.marcas.filter((marca) => marca.nombre.toLowerCase().includes(search));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: MarcaCreacionDto = {
      nombre: this.form.get('nombre')?.value.trim(),
    };

    const request = this.editingMarcaId
      ? this.marcasService.updateMarca(this.editingMarcaId, payload)
      : this.marcasService.createMarca(payload);

    request.subscribe({
      next: (result) => {
        if (this.editingMarcaId) {
          const index = this.marcas.findIndex((item) => item.id === this.editingMarcaId);
          if (index !== -1) {
            this.marcas[index] = result;
          }
          this.successMessage = 'Marca actualizada correctamente';
        } else {
          this.marcas.unshift(result);
          this.successMessage = 'Marca creada correctamente';
        }

        this.loading = false;
        this.closeModal();
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error saving marca:', err);
        this.error = err.error?.mensaje || 'Error al guardar la marca';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openDeleteConfirmModal(marca: Marca): void {
    this.marcaToDelete = marca;
    this.showDeleteConfirmModal = true;
    this.error = null;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirmModal = false;
    this.marcaToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.marcaToDelete) {
      return;
    }

    this.loading = true;
    this.marcasService.deleteMarca(this.marcaToDelete.id).subscribe({
      next: () => {
        this.marcas = this.marcas.filter((marca) => marca.id !== this.marcaToDelete?.id);
        this.successMessage = 'Marca eliminada correctamente';
        this.loading = false;
        this.showDeleteConfirmModal = false;
        this.marcaToDelete = null;
        this.clearMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting marca:', err);
        this.error = err.error?.mensaje || 'Error al eliminar la marca';
        this.loading = false;
        this.showDeleteConfirmModal = false;
        this.marcaToDelete = null;
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
