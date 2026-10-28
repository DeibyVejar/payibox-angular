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
      <h3 class="fw-bold mb-3">Nueva Contraseña</h3>
      
      <form (ngSubmit)="onSubmit()">
        <input 
          type="password" 
          class="form-control mb-3" 
          placeholder="Nueva contraseña" 
          [(ngModel)]="password" 
          name="password" 
          required 
        />
        <button class="btn btn-warning fw-bold w-100" type="submit" [disabled]="loading">
          {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
        </button>
      </form>

      <div *ngIf="message" class="alert alert-info mt-3">{{ message }}</div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  password = '';
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
    if (!this.password) return;
    this.loading = true;
    this.authService.confirmPasswordReset({ uid: this.uid, token: this.token, password: this.password }).subscribe({
      next: (res: any) => {
        this.message = 'Contraseña cambiada con éxito. Redirigiendo a Login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.message = err.error?.error || 'Token inválido o expirado.';
        this.loading = false;
      }
    });
  }
}