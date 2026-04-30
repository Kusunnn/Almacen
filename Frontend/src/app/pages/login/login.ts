import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit, OnDestroy {
  form!: FormGroup;
  showPassword = false;
  rememberMe = false;
  loading = false;
  error = '';
  validationErrors: { [key: string]: string } = {};
  formSubmitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadRememberedEmail();
    this.setupRealTimeValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private setupRealTimeValidation(): void {
    this.form.get('correo')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateFieldError('correo');
      });

    this.form.get('contrasena')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateFieldError('contrasena');
      });
  }

  private updateFieldError(fieldName: string): void {
    const control = this.form.get(fieldName);
    if (!control || !this.formSubmitted) return;

    if (control.hasError('required')) {
      this.validationErrors[fieldName] = `${fieldName === 'correo' ? 'Correo' : 'Contraseña'} requerido`;
    } else if (fieldName === 'correo' && control.hasError('email')) {
      this.validationErrors[fieldName] = 'Correo inválido';
    } else if (fieldName === 'contrasena' && control.hasError('minlength')) {
      this.validationErrors[fieldName] = 'Mínimo 6 caracteres';
    } else {
      delete this.validationErrors[fieldName];
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (!control || !this.formSubmitted || !control.invalid) return null;
    return this.validationErrors[fieldName] || null;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.error = '';

    // Validar todos los campos
    Object.keys(this.form.controls).forEach(key => {
      this.updateFieldError(key);
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.auth
      .login(this.form.value.correo, this.form.value.contrasena)
      .pipe(takeUntil(this.destroy$))
      .subscribe((ok) => {
        this.loading = false;

        if (ok) {
          // Guardar email si "recuerda sesión" está activo
          if (this.rememberMe) {
            localStorage.setItem('almacen.rememberedEmail', this.form.value.correo);
          } else {
            localStorage.removeItem('almacen.rememberedEmail');
          }
          this.router.navigate(['/dashboard']);
          return;
        }

        this.error = 'Correo o contraseña inválidos';
      });
  }

  private loadRememberedEmail(): void {
    const rememberedEmail = localStorage.getItem('almacen.rememberedEmail');
    if (rememberedEmail) {
      this.form.patchValue({ correo: rememberedEmail });
      this.rememberMe = true;
    }
  }
}
