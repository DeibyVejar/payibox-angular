import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './Register.component.html',
  styleUrl: './Register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onRegister() {
    // 1. Validación de contraseñas
    if (this.userData.password !== this.userData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // 2. Generar el username automáticamente a partir del email (evita error de Django)
    const username = this.userData.email.split('@')[0];

    // 3. Estructura de datos que espera el backend
    const dataToSend = {
      username: username,
      first_name: this.userData.first_name,
      last_name: this.userData.last_name,
      email: this.userData.email,
      password: this.userData.password
    };

    console.log('Enviando a la API:', dataToSend);

    this.authService.register(dataToSend).subscribe({
      next: (res: any) => {
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Error del servidor:', err.error);

        // Manejo de errores específicos que envía Django
        const errors = err.error;
        let mensaje = 'Error al registrar: ';

        if (typeof errors === 'object') {
          mensaje += Object.values(errors).join(' ');
        } else {
          mensaje += 'Revisa los campos obligatorios.';
        }

        alert(mensaje);
      }
    });
  }
}