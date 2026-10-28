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
    <div class="d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div class="p-4 text-center" style="max-width: 400px; width: 100%; background: #18181b; border-radius: 12px; border: 1px solid #27272a; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Logo de Payibox -->
        <img routerLink="" src="/images/payiboxlogo2.png" alt="Payibox Logo" class="mb-3" style="width: 100px; cursor: pointer;">
        
        <h3 class="fw-bold mb-1 text-light">Nueva Contraseña</h3>
        <p class="small mb-4" style="color: #a1a1aa;">Ingresa y confirma tu nueva clave de acceso.</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="mb-3 text-start">
            <label class="form-label text-light small fw-semibold">Nueva contraseña</label>
            <input 
              type="password" 
              class="form-control bg-dark text-light border-secondary shadow-none" 
              placeholder="Mínimo 6 caracteres" 
              [(ngModel)]="password" 
              name="password" 
              required 
              minlength="6"
              style="border-color: #3f3f46 !important;"
            />
          </div>

          <div class="mb-3 text-start">
            <label class="form-label text-light small fw-semibold">Confirmar contraseña</label>
            <input 
              type="password" 
              class="form-control bg-dark text-light border-secondary shadow-none" 
              placeholder="Repite tu contraseña" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              required 
              style="border-color: #3f3f46 !important;"
            />
            <div *ngIf="confirmPassword && password !== confirmPassword" class="text-danger small mt-1" style="font-size: 0.8rem;">
              Las contraseñas no coinciden.
            </div>
          </div>

          <button 
            class="btn btn-warning fw-bold w-100 py-2 mt-2" 
            type="submit" 
            [disabled]="loading || !password || password !== confirmPassword"
          >
            {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
        </form>

        <div *ngIf="message" class="alert alert-info mt-3 small text-start">{{ message }}</div>
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