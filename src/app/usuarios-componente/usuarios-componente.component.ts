import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

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

  public usuarios: any[] = [];
  public cargando: boolean = true;
  private idUsuarioLogueado: number | null = null;

  // Variables para la edición
  public usuarioEditando: any = null;
  public formEditar: any = {};

  // ==========================================
  // VARIABLES DE PAGINACIÓN (NUEVO)
  // ==========================================
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5; // Cantidad de usuarios por página
  public usuariosPaginados: any[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) this.idUsuarioLogueado = JSON.parse(user).id;
      this.obtenerUsuarios();
    }
  }

  obtenerUsuarios(): void {
    this.userService.getUsers().pipe(take(1)).subscribe({
      next: (data) => { 
        this.usuarios = data; 
        this.inicializarPaginacion(); // ✨ Iniciamos la paginación al recibir los datos
        this.cargando = false; 
      },
      error: (err) => { 
        console.error(err); 
        this.cargando = false; 
      }
    });
  }

  // ==========================================
  // MÉTODOS DE PAGINACIÓN (NUEVO)
  // ==========================================
  
  inicializarPaginacion() {
    this.paginaActual = 1;
    this.actualizarVistaPaginada();
  }

  actualizarVistaPaginada() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.usuariosPaginados = this.usuarios.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarVistaPaginada();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.itemsPorPagina);
  }

  // ==========================================
  // MÉTODOS DE EDICIÓN Y ELIMINACIÓN
  // ==========================================

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
        // Actualizar la lista localmente
        const index = this.usuarios.findIndex(u => u.id === this.usuarioEditando.id);
        this.usuarios[index] = { ...this.usuarios[index], ...res };
        
        // ✨ Actualizamos la vista paginada para reflejar el cambio
        this.actualizarVistaPaginada(); 
        
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
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
          
          // ✨ Ajustamos la paginación por si eliminamos el último elemento de la página
          if (this.usuariosPaginados.length === 1 && this.paginaActual > 1) {
            this.paginaActual--;
          }
          this.actualizarVistaPaginada();
        },
        error: (err) => alert('Error al eliminar.')
      });
    }
  }

  getInicial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }
}