import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.css']
})
export class StockComponent implements OnInit {
  private productService = inject(ProductService);
  private platformId = inject(PLATFORM_ID);

  public inventario: any[] = [];
  public cargando: boolean = true;

  // ==========================================
  // VARIABLES DE PAGINACIÓN
  // ==========================================
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5;
  public inventarioPaginado: any[] = [];

  // ==========================================
  // ✨ VARIABLES PARA LA EDICIÓN DE PRODUCTOS
  // ==========================================
  public productoSeleccionado: any = null;
  public editForm: any = { name: '', price: 0, stock: 0, description: '', category: null };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerInventario();

      this.productService.productoCreado$.subscribe(() => {
        this.obtenerInventario();
      });
    }
  }

  obtenerInventario(): void {
    this.productService.getProducts().pipe(take(1)).subscribe({
      next: (data) => {
        this.inventario = data;
        this.inicializarPaginacion();
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al cargar el inventario:", err);
        this.cargando = false;
      }
    });
  }

  // ==========================================
  // MÉTODOS DE PAGINACIÓN
  // ==========================================
  inicializarPaginacion() {
    this.paginaActual = 1;
    this.actualizarVistaPaginada();
  }

  actualizarVistaPaginada() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.inventarioPaginado = this.inventario.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarVistaPaginada();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.inventario.length / this.itemsPorPagina);
  }

  // ==========================================
  // MÉTODOS DE UTILIDAD Y ACCIÓN
  // ==========================================
  getNumero(valor: any): number {
    return parseFloat(valor) || 0;
  }

  ajustarStock(item: any, cantidadCambio: number): void {
    const nuevoStock = item.stock + cantidadCambio;
    if (nuevoStock < 0) return;

    const dataActualizada = {
      name: item.name,
      price: item.price,
      stock: nuevoStock,
      category: item.category?.id || item.category
    };

    this.productService.updateProduct(item.id, dataActualizada).pipe(take(1)).subscribe({
      next: (res) => {
        item.stock = res.stock;
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al actualizar el stock.');
      }
    });
  }

  // ==========================================
  // ✨ MÉTODOS NUEVOS PARA EDITAR PRODUCTO
  // ==========================================
  abrirEdicion(producto: any) {
    this.productoSeleccionado = producto;
    this.editForm = {
      name: producto.name,
      price: producto.price,
      stock: producto.stock,
      description: producto.description || '',
      category: producto.category?.id || producto.category
    };
  }

  guardarCambiosEdicion() {
    if (!this.productoSeleccionado) return;

    this.productService.updateProduct(this.productoSeleccionado.id, this.editForm).pipe(take(1)).subscribe({
      next: (res) => {
        // Actualizamos de forma reactiva el elemento en el inventario local
        const index = this.inventario.findIndex(item => item.id === this.productoSeleccionado.id);
        if (index !== -1) {
          this.inventario[index] = { ...this.inventario[index], ...res };
          this.actualizarVistaPaginada();
        }
        this.productoSeleccionado = null;
        alert('¡Artículo modificado con éxito!');
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        alert('No se pudo actualizar el artículo.');
      }
    });
  }

  eliminarItem(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto de Payibox?')) {
      this.productService.deleteProduct(id).pipe(take(1)).subscribe({
        next: () => {
          this.inventario = this.inventario.filter(item => item.id !== id);
          
          if (this.inventarioPaginado.length === 1 && this.paginaActual > 1) {
            this.paginaActual--;
          }
          this.actualizarVistaPaginada();
        },
        error: (err) => alert('Error al eliminar el producto.')
      });
    }
  }
}