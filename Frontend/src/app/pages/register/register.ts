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
    if (this.form.idRol === null || this.form.edad === null) {
      this.error = 'Completa todos los campos obligatorios';
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
          this.error =
            error?.error?.mensaje ?? 'No se pudo registrar el usuario';
        },
      });
  }
}
