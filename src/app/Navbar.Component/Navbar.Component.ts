import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/car.services';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './Navbar.Component.html',
  styleUrl: './Navbar.Component.css'
})

export class NavbarComponent {

   cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

 logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    }); 
  }
}