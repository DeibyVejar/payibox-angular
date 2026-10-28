import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div class="login-container w-100" style="max-width: 420px; padding: 20px;">
        <div class="login-box text-center">
          
          <!-- Logo de Payibox -->
          <img routerLink="" src="/images/payiboxlogo2.png" alt="Payibox Logo" class="mb-3" style="width: 120px; cursor: pointer;">
          
          <h2 class="h3 fw-bold text-light mb-2">Nueva Contraseña</h2>
          <p class="text-light-50 small mb-4" style="color: #ccc;">Ingresa y confirma tu nueva clave de acceso.</p>
          
          <form (ngSubmit)="onSubmit()">
            <div class="form-group mb-3 text-start">
              <label class="form-label text-light small">Nueva contraseña</label>
              <input 
                type="password" 
                class="form-control form-control-custom" 
                placeholder="Mínimo 6 caracteres" 
                [(ngModel)]="password" 
                name="password" 
                required 
                minlength="6"
              />
            </div>

            <div class="form-group mb-3 text-start">
              <label class="form-label text-light small">Confirmar contraseña</label>
              <input 
                type="password" 
                class="form-control form-control-custom" 
                placeholder="Repite tu contraseña" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required 
              />
              <div *ngIf="confirmPassword && password !== confirmPassword" class="text-danger small mt-1">
                Las contraseñas no coinciden.
              </div>
            </div>

            <button 
              class="btn-primary-custom w-100 py-3 mt-3 fw-bold" 
              type="submit" 
              [disabled]="loading || !password || password !== confirmPassword"
            >
              {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
            </button>
          </form>

          <div *ngIf="message" class="alert alert-info mt-4 small">{{ message }}</div>

        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirmPassword = '';
  uid = '';
  token = '';
  loading = false;
  message = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    if (!this.password || this.password !== this.confirmPassword) {
      this.message = 'Por favor, verifica que las contraseñas coincidan.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.confirmPasswordReset({ 
      uid: this.uid, 
      token: this.token, 
      password: this.password 
    }).subscribe({
      next: () => {
        this.message = '¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.message = err.error?.error || 'El enlace es inválido o ha expirado.';
        this.loading = false;
      }
    });
  }
}