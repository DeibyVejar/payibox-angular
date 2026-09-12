import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 1. Importar CommonModule para usar *ngIf
import { SpinnerComponent } from '../spinner/spinner.component'; // 2. Importar el Spinner

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, SpinnerComponent], // 3. Añadirlos a los imports
  templateUrl: './Login.component.html',
  styleUrl: './Login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  credentials = { email: '', password: '' };
  cargando: boolean = false; // 4. Variable para controlar el estado de carga

  onSubmit() {
    this.cargando = true; // Activamos el spinner al enviar

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.authService.setUser({
          email: this.credentials.email,
          token: response.access
        });

        localStorage.setItem('access', response.access);
        
        // El spinner se quedará visible hasta que navegue o termine
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        this.cargando = false; // Desactivamos el spinner si hay un error para que pueda reintentar
        console.error('Error en el login', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}