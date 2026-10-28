import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service'; // Ajusta la ruta si es necesario
import { NavbarComponent } from './Navbar.Component/navbar.component'; // Ajusta las rutas de tus componentes
import { NavbaradminComponents } from './NavbaradminComponents/navbaradmin.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    NavbarComponent, 
    NavbaradminComponents, 
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  public authService = inject(AuthService);

  public isClient = false;
  public isAuthPage = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isClient = true;

      // Escuchar cambios de ruta para detectar páginas de autenticación
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        
        // Rutas donde se ocultarán el Navbar y el Footer
        this.isAuthPage = [
          '/login', 
          '/register', 
          '/forgot-password'
        ].includes(url) || url.startsWith('/reset-password');
      });
    }
  }
}