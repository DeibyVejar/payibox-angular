import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // 👈 Ruta correcta desde Logincomponents

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5 pt-5 text-center" style="max-width: 400px;">
      <h3 class="fw-bold mb-3">Recuperar Contraseña</h3>
      <p class="text-muted">Ingresa tu correo registrado y te enviaremos un enlace.</p>
      
      <form (ngSubmit)="onSubmit()">
        <input 
          type="email" 
          class="form-control mb-3" 
          placeholder="Correo electrónico" 
          [(ngModel)]="email" 
          name="email" 
          required 
        />
        <button class="btn btn-warning fw-bold w-100" type="submit" [disabled]="loading">
          {{ loading ? 'Enviando...' : 'Enviar enlace' }}
        </button>
      </form>

      <div *ngIf="message" class="alert alert-info mt-3">{{ message }}</div>
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
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.loading = false;
      },
      error: () => {
        this.message = 'Ocurrió un error. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }
}