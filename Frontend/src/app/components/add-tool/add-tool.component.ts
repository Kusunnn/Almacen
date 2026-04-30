import { Component, EventEmitter, Input, Output, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiTool, ToolsService, CreateToolRequest, Brand } from '../../services/tools.service';

interface ToolType {
  id: number;
  nombre: string;
}

interface Warehouse {
  id: number;
  nombre: string;
}

interface FormData {
  nombre: string;
  descripcion: string;
  id_tipo: number | null;
  id_marca: number | null;
  estado: string;
  fecha_ingreso: string;
  disponibilidad: boolean;
  id_almacen: number | null;
  cantidad: number;
}

@Component({
  selector: 'app-add-tool',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-tool.component.html',
  styleUrls: ['./add-tool.component.scss'],
})
export class AddToolComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() tool: ApiTool | null = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() loadingData: boolean = false;

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  private readonly toolsService = inject(ToolsService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  loading = false;
  submitError = '';

  toolTypes: ToolType[] = [];
  brands: Brand[] = [];
  warehouses: Warehouse[] = [];

  imageFile: File | null = null;
  imagePreview: string | null = null;
  imageFileName: string = '';

  constructor() {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadCatalogues();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tool']) {
      if (this.tool) {
        this.populateForm(this.tool);
      } else {
        this.resetFormState();
      }
    }

    if (changes['isOpen'] && this.isOpen && !this.tool) {
      this.resetFormState();
    }
  }

  private initializeForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: [''],
      id_tipo: [null],
      id_marca: [null],
      estado: ['disponible'],
      fecha_ingreso: [''],
      disponibilidad: [true],
      id_almacen: [null],
      cantidad: [0, [Validators.min(0)]],
    });
  }

  private loadCatalogues() {
    this.toolsService.getToolTypes().subscribe({
      next: (types) => (this.toolTypes = types),
      error: () => (this.toolTypes = []),
    });

    this.toolsService.getBrands().subscribe({
      next: (brands) => (this.brands = brands),
      error: () => (this.brands = []),
    });

    this.toolsService.getWarehouses().subscribe({
      next: (warehouses) => (this.warehouses = warehouses),
      error: () => (this.warehouses = []),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.imageFile = file;
      this.imageFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePreview = null;
    this.imageFileName = '';
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  get isEditMode(): boolean {
    return this.mode === 'edit' && !!this.tool;
  }

  get isHeaderEditMode(): boolean {
    return this.mode === 'edit';
  }

  private populateForm(tool: ApiTool) {
    const fecha = tool.fecha_ingreso ? tool.fecha_ingreso.split('T')[0] : '';
    this.form.patchValue({
      nombre: tool.nombre ?? '',
      descripcion: tool.descripcion ?? '',
      id_tipo: tool.id_tipo ?? null,
      id_marca: tool.id_marca ?? null,
      estado: tool.estado ?? 'disponible',
      fecha_ingreso: fecha,
      disponibilidad: tool.disponibilidad ?? false,
      id_almacen: tool.id_almacen ?? null,
      cantidad: tool.cantidad ?? 0,
    });
    this.imageFile = null;
    this.imageFileName = '';
    this.imagePreview = tool.foto_herramienta ?? null;
    this.submitError = '';
  }

  private resetFormState() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      id_tipo: null,
      id_marca: null,
      estado: 'disponible',
      fecha_ingreso: '',
      disponibilidad: true,
      id_almacen: null,
      cantidad: 0,
    });
    this.removeImage();
    this.submitError = '';
  }

  private async buildPayload(): Promise<CreateToolRequest> {
    const formValue = this.form.value;
    let fechaIngreso = formValue.fecha_ingreso;
    if (fechaIngreso) {
      const date = new Date(fechaIngreso);
      fechaIngreso = date.toISOString().split('T')[0];
    }

    const payload: CreateToolRequest = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion || null,
      id_tipo: formValue.id_tipo ? Number(formValue.id_tipo) : null,
      id_marca: formValue.id_marca ? Number(formValue.id_marca) : null,
      estado: formValue.estado || null,
      fecha_ingreso: fechaIngreso || null,
      disponibilidad: formValue.disponibilidad,
      id_almacen: formValue.id_almacen ? Number(formValue.id_almacen) : null,
      cantidad: formValue.cantidad || null,
    };

    if (this.imageFile) {
      payload.foto_herramienta = await this.convertFileToBase64(this.imageFile);
    }

    return payload;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.submitError = 'Por favor completa los campos requeridos';
      return;
    }

    if (this.isEditMode && !this.tool) {
      this.submitError = 'No se encontró la herramienta a editar';
      return;
    }

    this.loading = true;
    this.submitError = '';

    try {
      const payload = await this.buildPayload();

      if (this.isEditMode && this.tool) {
        this.toolsService.updateTool(this.tool.id, payload).subscribe({
          next: () => {
            this.loading = false;
            this.saved.emit();
            this.onCancel();
          },
          error: (error) => {
            this.loading = false;
            this.submitError = error?.error?.mensaje || 'Error al actualizar la herramienta';
          },
        });
      } else {
        this.toolsService.createTool(payload).subscribe({
          next: () => {
            this.loading = false;
            this.form.reset();
            this.removeImage();
            this.created.emit();
            this.onCancel();
          },
          error: (error) => {
            this.loading = false;
            this.submitError = error?.error?.mensaje || 'Error al crear la herramienta';
          },
        });
      }
    } catch {
      this.loading = false;
      this.submitError = 'Error procesando la imagen';
    }
  }

  async onDelete() {
    if (!this.tool) {
      this.submitError = 'No se encontró la herramienta a eliminar';
      return;
    }

    this.loading = true;
    this.submitError = '';

    this.toolsService.deleteTool(this.tool.id).subscribe({
      next: () => {
        this.loading = false;
        this.deleted.emit();
        this.onCancel();
      },
      error: (error) => {
        this.loading = false;
        this.submitError = error?.error?.mensaje || 'Error al eliminar la herramienta';
      },
    });
  }

  onCancel() {
    this.form.reset();
    this.removeImage();
    this.submitError = '';
    this.closed.emit();
  }
}
