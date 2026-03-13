import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { Login } from './login';
import { AuthService } from '../../services/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: {
    login: ReturnType<typeof vi.fn>;
    isAuthenticated: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    auth = {
      login: vi.fn(),
      isAuthenticated: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login, RouterTestingModule, FormsModule],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid credentials', () => {
    auth.login.mockReturnValue(of(false));
    component.credentials.correo = 'foo@bar.com';
    component.credentials.contrasena = 'bar';

    component.onSubmit();

    expect(component.error).toBe('Correo o contraseña inválidos');
  });

  it('should accept correct credentials', () => {
    auth.login.mockReturnValue(of(true));
    component.credentials.correo = 'admin@correo.com';
    component.credentials.contrasena = '123456';

    component.onSubmit();

    expect(component.error).toBe('');
    expect(auth.login).toHaveBeenCalledWith('admin@correo.com', '123456');
  });
});
