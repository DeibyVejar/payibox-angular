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
    this.authService.logout(); // Borra la sesión
    
    // 3. Forzar redirección y recarga para sacar al usuario de inmediato de la vista protegida
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}