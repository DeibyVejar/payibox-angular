import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminUploadComponent } from '../admin-upload/adminuploadcomponents/adminuploadcomponent.component';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminUploadComponent],
  templateUrl: './Navbaradmin.Component.html',
  styleUrls: ['./Navbaradmin.Component.css']
})
export class NavbarAdminComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  mostrarModalSubir: boolean = false;
  isClient: boolean = false;

  ngOnInit(): void {
    // Retorna true solo cuando ya estamos ejecutando en el navegador
    this.isClient = isPlatformBrowser(this.platformId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}