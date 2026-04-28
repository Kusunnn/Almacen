import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnInit {
  private readonly maxPhotoSizeBytes = 1_500_000;

  roles: { id: number; nombre: string }[] = [];
  loadingRoles = true;
  submitting = false;
  error = '';
  success = '';
  selectedPhotoName = '';
  photoPreview = '';

  form = {
    nombre: '',
    edad: null as number | null,
    telefono: '',
    direccion: '',
    correo: '',
    contrasena: '',
    idRol: null as number | null,
    fotoPerfil: '',
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loadingRoles = false;
      },
      error: () => {
        this.loadingRoles = false;
        this.error = 'No se pudieron cargar los roles';
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    this.error = '';

    if (!file) {
      this.clearPhoto();
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.clearPhoto(input);
      this.error = 'Selecciona un archivo de imagen válido';
      return;
    }

    if (file.size > this.maxPhotoSizeBytes) {
      this.clearPhoto(input);
      this.error = 'La foto no debe superar 1.5 MB';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.form.fotoPerfil = result;
      this.photoPreview = result;
      this.selectedPhotoName = file.name;
    };

    reader.onerror = () => {
      this.clearPhoto(input);
      this.error = 'No se pudo leer la imagen seleccionada';
    };

    reader.readAsDataURL(file);
  }

  clearPhoto(input?: HTMLInputElement | null): void {
    this.form.fotoPerfil = '';
    this.photoPreview = '';
    this.selectedPhotoName = '';

    if (input) {
      input.value = '';
    }
  }

  onSubmit(): void {
    const validationError = this.getValidationError();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    this.usersService
      .register({
        nombre: this.form.nombre,
        edad: Number(this.form.edad),
        telefono: this.form.telefono,
        direccion: this.form.direccion,
        correo: this.form.correo,
        contrasena: this.form.contrasena,
        idRol: Number(this.form.idRol),
        fotoPerfil: this.form.fotoPerfil.trim() || null,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.success = 'Usuario creado correctamente';
          window.setTimeout(() => this.router.navigate(['/login']), 900);
        },
        error: (error) => {
          this.submitting = false;
          this.error = this.getApiErrorMessage(error);
        },
      });
  }

  private getValidationError(): string {
    const nombre = this.form.nombre.trim();
    const telefono = this.form.telefono.trim();
    const direccion = this.form.direccion.trim();
    const correo = this.form.correo.trim();
    const contrasena = this.form.contrasena;

    if (
      !nombre ||
      this.form.edad === null ||
      !telefono ||
      !direccion ||
      !correo ||
      !contrasena ||
      this.form.idRol === null
    ) {
      return 'Completa todos los campos obligatorios';
    }

    if (nombre.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }

    if (Number(this.form.edad) < 0 || Number(this.form.edad) > 120) {
      return 'La edad debe estar entre 0 y 120';
    }

    if (telefono.length < 7 || telefono.length > 20) {
      return 'El teléfono debe tener entre 7 y 20 caracteres';
    }

    if (direccion.length < 5 || direccion.length > 255) {
      return 'La dirección debe tener entre 5 y 255 caracteres';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return 'Ingresa un correo válido';
    }

    if (contrasena.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    return '';
  }

  private getApiErrorMessage(error: any): string {
    const body = error?.error;

    if (Array.isArray(body?.errores) && body.errores.length > 0) {
      return body.errores
        .map((item: { campo?: string; mensaje?: string }) =>
          item.campo ? `${item.campo}: ${item.mensaje}` : item.mensaje
        )
        .filter(Boolean)
        .join('. ');
    }

    if (Array.isArray(body?.detalles) && body.detalles.length > 0) {
      return body.detalles.join('. ');
    }

    return body?.mensaje ?? 'No se pudo registrar el usuario';
  }
}
