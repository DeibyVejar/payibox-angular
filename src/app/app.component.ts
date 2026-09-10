import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgClass } from '@angular/common';
// 1. IMPORTA tus navbars aquí
import { NavbarComponent } from './Navbar.Component/Navbar.Component';
import { NavbarAdminComponent } from './NavbaradminComponents/Navbaradmin.Component';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  // 2. AÑADE los componentes al array de imports
  imports: [
    NgClass,
    RouterOutlet, 
    NavbarComponent, 
    NavbarAdminComponent, 
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Payibox';
  
  // 3. INYECTA el AuthService como PUBLIC para que el HTML lo vea
  public authService = inject(AuthService);
  private router = inject(Router);
  
  public isAuthPage = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Ocultamos la navbar en login y register
      this.isAuthPage = url === '/login' || url === '/register';
    });
  }
}