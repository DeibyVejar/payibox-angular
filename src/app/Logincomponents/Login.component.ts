import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Asegúrate de importar Router
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './Login.component.html',
  styleUrl: './Login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Cambiamos 'username' por 'email'
  credentials = { email: '', password: '' };

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        // Guardamos el email en el servicio, no el username
        this.authService.setUser({
          email: this.credentials.email,
          token: response.access
        });

        localStorage.setItem('access', response.access);
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        console.error('Error en el login', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}