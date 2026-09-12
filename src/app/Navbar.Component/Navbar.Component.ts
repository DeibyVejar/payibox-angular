import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // 1. Importar Router
import { AuthService } from '../services/auth.service';
import { AdminUploadComponent } from '../admin-upload/adminuploadcomponents/adminuploadcomponent.component';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminUploadComponent],
  templateUrl: './Navbaradmin.Component.html',
  styleUrls: ['./Navbaradmin.Component.css']
})
export class NavbarAdminComponent {
  public authService = inject(AuthService);
  private router = inject(Router); // 2. Inyectar el Router
  mostrarModalSubir: boolean = false;

  logout() {
    // Llamamos al logout del servicio (que borra el localStorage / token)
    this.authService.logout();

    // Forzamos la redirección inmediata a la tienda o al login
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Limpia estados residuales de memoria en Angular
    });
  }
}