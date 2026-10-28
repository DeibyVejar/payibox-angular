import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

import { NavbarComponent } from './Navbar.Component/Navbar.Component'; 
// 👈 Nombre corregido a 'NavbarAdminComponent'
import { NavbarAdminComponent } from './NavbaradminComponents/Navbaradmin.Component'; 
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    NavbarComponent, 
    NavbarAdminComponent, // 👈 Nombre corregido aquí también
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

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        
        this.isAuthPage = [
          '/login', 
          '/register', 
          '/forgot-password'
        ].includes(url) || url.startsWith('/reset-password');
      });
    }
  }
}