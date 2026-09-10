import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Eliminamos RouterLinkActive
import { AuthService } from '../services/auth.service';
import { AdminUploadComponent } from '../admin-upload/adminuploadcomponents/adminuploadcomponent.component';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  // Eliminamos RouterLinkActive de los imports
  imports: [CommonModule, RouterLink, AdminUploadComponent],
  templateUrl: './Navbaradmin.Component.html',
  styleUrls: ['./Navbaradmin.Component.css']
})
export class NavbarAdminComponent {
  public authService = inject(AuthService);
  mostrarModalSubir: boolean = false;

  logout() {
    this.authService.logout();
  }
}