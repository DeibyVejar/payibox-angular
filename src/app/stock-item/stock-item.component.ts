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
  public itemsPorPagina: number = 3; // Cantidad de artículos por página
  public inventarioPaginado: any[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerInventario();

      // 1. Escuchar cuando se crea un producto para refrescar la lista automáticamente
      this.productService.productoCreado$.subscribe(() => {
        this.obtenerInventario();
      });
    }
  }

  obtenerInventario(): void {
    this.productService.getProducts().pipe(take(1)).subscribe({
      next: (data) => {
        this.inventario = data;
        this.inicializarPaginacion(); // ✨ Inicializamos la paginación al recibir datos
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.inventario.length / this.itemsPorPagina);
  }

  // ==========================================
  // MÉTODOS EXISTENTES
  // ==========================================

  // El método que nos faltaba para procesar los precios correctamente
  getNumero(valor: any): number {
    return parseFloat(valor) || 0;
  }

  // Aumentar o disminuir stock directamente desde la tabla
  ajustarStock(item: any, cantidadCambio: number): void {
    const nuevoStock = item.stock + cantidadCambio;
    if (nuevoStock < 0) return;

    // Solo enviamos los datos mínimos necesarios
    const dataActualizada = {
      name: item.name,
      price: item.price,
      stock: nuevoStock,
      category: item.category.id // Enviamos solo el ID de la categoría
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

  // Eliminar un artículo por completo
  eliminarItem(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto de Payibox?')) {
      this.productService.deleteProduct(id).pipe(take(1)).subscribe({
        next: () => {
          this.inventario = this.inventario.filter(item => item.id !== id);
          
          // ✨ Ajustamos la paginación si se elimina el último elemento de la página
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