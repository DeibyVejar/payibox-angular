import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, SpinnerComponent],
  templateUrl: './Register.component.html',
  styleUrl: './Register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando: boolean = false;

  userData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onRegister() {
    if (this.cargando) return;

    // Permite letras (mayúsculas/minúsculas), acentos, la letra ñ y espacios
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // 1. Validación de nombre y apellido
    if (!this.userData.first_name.trim() || !nombreRegex.test(this.userData.first_name.trim())) {
      alert('El nombre solo debe contener letras.');
      return;
    }

    if (!this.userData.last_name.trim() || !nombreRegex.test(this.userData.last_name.trim())) {
      alert('El apellido solo debe contener letras.');
      return;
    }

    // 2. Validación de contraseñas
    if (this.userData.password !== this.userData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.cargando = true;

    // 3. Generar el username automáticamente a partir del email
    const username = this.userData.email.split('@')[0];

    // 4. Estructura de datos limpia enviada al backend
    const dataToSend = {
      username: username,
      first_name: this.userData.first_name.trim(),
      last_name: this.userData.last_name.trim(),
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
        this.cargando = false;
        console.error('Error del servidor:', err.error);

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