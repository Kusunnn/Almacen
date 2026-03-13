import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { Login } from './login';
import { AuthService } from '../../services/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, RouterTestingModule, FormsModule],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    auth = TestBed.inject(AuthService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid credentials', () => {
    component.credentials.username = 'foo';
    component.credentials.password = 'bar';
    expect(component.onSubmit()).toBeFalse();
    expect(component.error).toBe('Usuario o contraseña inválidos');
  });

  it('should accept correct credentials', () => {
    component.credentials.username = 'admin';
    component.credentials.password = '1234';
    expect(component.onSubmit()).toBeTrue();
    expect(auth.isAuthenticated).toBeTrue();
  });
});
