import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AdminUploadComponent } from '../admin-upload/adminuploadcomponents/adminuploadcomponent.component';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AdminUploadComponent],
  templateUrl: './Navbaradmin.Component.html',
  styleUrls: ['./Navbaradmin.Component.css']
})
export class NavbarAdminComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  mostrarModalSubir: boolean = false;
  mostrarModalTasa: boolean = false;
  isClient: boolean = false;

  // Lógica de Tasa de Cambio
  nuevaTasa: number = 0.0095;
  mensajeTasa: string = '';
  cargandoTasa: boolean = false;

  ngOnInit(): void {
    this.isClient = isPlatformBrowser(this.platformId);
    if (this.isClient) {
      this.cargarTasaActual();
    }
  }

  cargarTasaActual() {
    this.http.get<any>('https://payiboxgym.pythonanywhere.com/api/users/tasa-cambio/').subscribe({
      next: (res) => {
        if (res && res.tasa_cop_ves) {
          this.nuevaTasa = res.tasa_cop_ves;
        }
      },
      error: (err) => console.error('Error al cargar la tasa:', err)
    });
  }

  actualizarTasa() {
    if (!this.nuevaTasa || this.nuevaTasa <= 0) return;

    this.cargandoTasa = true;
    this.mensajeTasa = '';

    this.http.post<any>('https://payiboxgym.pythonanywhere.com/api/users/tasa-cambio/', {
      tasa_cop_ves: this.nuevaTasa
    }).subscribe({
      next: (res) => {
        this.mensajeTasa = '¡Tasa actualizada en tiempo real!';
        this.cargandoTasa = false;
        setTimeout(() => {
          this.cerrarModalTasa();
        }, 1500);
      },
      error: (err) => {
        this.mensajeTasa = 'Error al actualizar la tasa.';
        this.cargandoTasa = false;
      }
    });
  }

  cerrarModalTasa() {
    this.mostrarModalTasa = false;
    this.mensajeTasa = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}