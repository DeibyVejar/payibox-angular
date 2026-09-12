import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container text-center py-5 mt-5">
      <div class="card shadow p-5 mx-auto" style="max-width: 500px;">
        <h1 class="text-danger fw-bold display-4 mb-3">403</h1>
        <h2>Acceso Denegado</h2>
        <p class="text-muted mt-2">
          No tienes los permisos de administrador necesarios para visualizar esta sección.
        </p>
        <div class="mt-4">
          <a routerLink="/" class="btn btn-dark px-4">Volver al Inicio</a>
        </div>
      </div>
    </div>
  `
})
export class AccesoDenegadoComponent {}