import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { NavbarComponent } from './NavbarComponents/Navbar.Component';
import { NavbarAdminComponent } from './NavbaradminComponents/Navbaradmin.Component';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet, 
    NavbarComponent, 
    NavbarAdminComponent, 
    CommonModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Payibox';

  public authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public isAuthPage = false;
  public isClient = false;

  ngOnInit(): void {
    // Se activa únicamente en el navegador cuando ya se tiene acceso a localStorage
    this.isClient = isPlatformBrowser(this.platformId);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.isAuthPage = url === '/login' || url === '/register';
    });
  }
}