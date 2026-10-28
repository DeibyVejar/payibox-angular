import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5 pt-5 text-center" style="max-width: 400px;">
      <h3 class="fw-bold mb-3 text-light">Nueva Contraseña</h3>
      <p class="text-muted small">Ingresa y confirma tu nueva clave de acceso.</p>
      
      <form (ngSubmit)="onSubmit()">
        <div class="mb-3 text-start">
          <input 
            type="password" 
            class="form-control" 
            placeholder="Nueva contraseña" 
            [(ngModel)]="password" 
            name="password" 
            required 
            minlength="6"
          />
        </div>

        <div class="mb-3 text-start">
          <input 
            type="password" 
            class="form-control" 
            placeholder="Confirmar contraseña" 
            [(ngModel)]="confirmPassword" 
            name="confirmPassword" 
            required 
          />
          <div *ngIf="confirmPassword && password !== confirmPassword" class="text-danger small mt-1">
            Las contraseñas no coinciden.
          </div>
        </div>

        <button 
          class="btn btn-warning fw-bold w-100 py-2" 
          type="submit" 
          [disabled]="loading || !password || password !== confirmPassword"
        >
          {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
        </button>
      </form>

      <div *ngIf="message" class="alert alert-info mt-3 small">{{ message }}</div>
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