import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div class="p-4 text-center" style="max-width: 400px; width: 100%; background: #18181b; border-radius: 12px; border: 1px solid #27272a; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Logo de Payibox -->
        <img routerLink="" src="/images/payiboxlogo2.png" alt="Payibox Logo" class="mb-3" style="width: 100px; cursor: pointer;">
        
        <h3 class="fw-bold mb-1 text-light">Recuperar Contraseña</h3>
        <p class="small mb-4" style="color: #a1a1aa;">Ingresa tu correo registrado y te enviaremos un enlace.</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="mb-3 text-start">
            <label class="form-label text-light small fw-semibold">Correo electrónico</label>
            <input 
              type="email" 
              class="form-control bg-dark text-light border-secondary shadow-none" 
              placeholder="nombre@ejemplo.com" 
              [(ngModel)]="email" 
              name="email" 
              required 
              style="border-color: #3f3f46 !important;"
            />
          </div>

          <button 
            class="btn btn-warning fw-bold w-100 py-2 mt-2" 
            type="submit" 
            [disabled]="loading || !email"
          >
            {{ loading ? 'Enviando...' : 'Enviar enlace' }}
          </button>
        </form>

        <!-- Mensajes de feedback estilizados -->
        <div *ngIf="message" class="alert alert-info mt-3 small text-start border-0" style="background: #27272a; color: #38bdf8;">
          {{ message }}
        </div>

        <div class="mt-4 pt-2 border-top border-secondary" style="border-color: #27272a !important;">
          <a routerLink="/login" class="small text-decoration-none" style="color: #a1a1aa;">
            Volver a Iniciar Sesión
          </a>
        </div>

      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';

  private authService = inject(AuthService);

  onSubmit() {
    if (!this.email) return;

    this.loading = true;
    this.message = '';

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.';
        this.loading = false;
      },
      error: (err: any) => {
        this.message = err.error?.error || 'Ocurrió un error al enviar la solicitud. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }
}