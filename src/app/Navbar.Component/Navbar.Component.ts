import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { CartService } from '../services/car.services';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './Navbar.Component.html',
  styleUrl: './Navbar.Component.css'
})
export class NavbarComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);
  private platformId = inject(PLATFORM_ID);

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