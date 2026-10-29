import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios-componente.component.html',
  styleUrls: ['./usuarios-componente.component.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  public usuarios: any[] = [];
  public cargando: boolean = true;
  private idUsuarioLogueado: number | null = null;

  // Variables para la edición de usuario
  public usuarioEditando: any = null;
  public formEditar: any = {};

  // Variables para la tasa de cambio
  public nuevaTasa: number = 0.0095;
  public mensajeTasa: string = '';
  public cargandoTasa: boolean = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) this.idUsuarioLogueado = JSON.parse(user).id;
      this.obtenerUsuarios();
      this.cargarTasaActual();
    }
  }

  // LÓGICA DE TASA DE CAMBIO
  cargarTasaActual(): void {
    this.http.get<any>('https://payiboxgym.pythonanywhere.com/api/users/tasa-cambio/').subscribe({
      next: (res) => {
        if (res && res.tasa_cop_ves) {
          this.nuevaTasa = res.tasa_cop_ves;
        }
      },
      error: (err) => console.error('Error al cargar la tasa:', err)
    });
  }

  actualizarTasa(): void {
    if (!this.nuevaTasa || this.nuevaTasa <= 0) return;

    this.cargandoTasa = true;
    this.mensajeTasa = '';

    this.http.post<any>('https://payiboxgym.pythonanywhere.com/api/users/tasa-cambio/', {
      tasa_cop_ves: this.nuevaTasa
    }).subscribe({
      next: (res) => {
        this.mensajeTasa = '¡Tasa actualizada con éxito!';
        this.cargandoTasa = false;
        setTimeout(() => this.mensajeTasa = '', 3000);
      },
      error: (err) => {
        this.mensajeTasa = 'Error al actualizar la tasa.';
        this.cargandoTasa = false;
      }
    });
  }

  // LÓGICA DE USUARIOS
  obtenerUsuarios(): void {
    this.userService.getUsers().pipe(take(1)).subscribe({
      next: (data) => { this.usuarios = data; this.cargando = false; },
      error: (err) => { console.error(err); this.cargando = false; }
    });
  }

  iniciarEdicion(usuario: any): void {
    this.usuarioEditando = usuario;
    this.formEditar = { ...usuario, password: '' };
  }

  cancelarEdicion(): void {
    this.usuarioEditando = null;
    this.formEditar = {};
  }

  guardarCambios(): void {
    this.userService.updateUser(this.usuarioEditando.id, this.formEditar).pipe(take(1)).subscribe({
      next: (res) => {
        const index = this.usuarios.findIndex(u => u.id === this.usuarioEditando.id);
        this.usuarios[index] = { ...this.usuarios[index], ...res };
        this.cancelarEdicion();
        alert('Usuario actualizado correctamente.');
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar: asegúrate de que el correo no esté duplicado.');
      }
    });
  }

  eliminarUsuario(usuario: any): void {
    if (usuario.id === this.idUsuarioLogueado) {
      alert('No puedes eliminar tu propia cuenta.');
      return;
    }
    if (confirm(`¿Eliminar a ${usuario.name}?`)) {
      this.userService.deleteUser(usuario.id).pipe(take(1)).subscribe({
        next: () => this.usuarios = this.usuarios.filter(u => u.id !== usuario.id),
        error: (err) => alert('Error al eliminar.')
      });
    }
  }

  getInicial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }
}