import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 1. Importar CommonModule
import { SpinnerComponent } from '../spinner/spinner.component'; // 2. Importar SpinnerComponent

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, SpinnerComponent], // 3. Añadir a imports
  templateUrl: './Register.component.html',
  styleUrl: './Register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando: boolean = false; // 4. Variable para controlar el estado de carga

  userData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onRegister() {
    // Evita ejecuciones duplicadas si la petición ya está en proceso
    if (this.cargando) return;

    // 1. Validación de contraseñas
    if (this.userData.password !== this.userData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.cargando = true; // Activar spinner al enviar

    // 2. Generar el username automáticamente a partir del email
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
        this.cargando = false; // Desactivar spinner para corregir datos e reintentar
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