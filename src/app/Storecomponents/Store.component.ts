import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService, Product } from '../services/car.services';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Store.component.html',
  styleUrl: './Store.component.css'
})
export class StoreComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private sub: Subscription = new Subscription();

  // Control de filtros
  public categoriaSeleccionada: string = 'todos';
  public categorias: string[] = ['todos', 'franelas', 'shorts', 'faldas', 'accesorios'];

  // Diccionario de palabras clave por categoría
  private palabrasClaveCategorias: { [key: string]: string[] } = {
    franelas: ['franela', 'camisa', 'top', 't-shirt', 'playera', 'remera', 'sweater'],
    shorts: ['short', 'pantalón corto', 'pantaloneta', 'bermuda'],
    faldas: ['falda', 'skirt'],
    accesorios: ['gorra', 'termo', 'guantes', 'cinturon', 'cinto', 'mochila', 'bolso', 'banda', 'strap', 'medias']
  };

  cartService = inject(CartService);
  productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();

    // Escuchar si se crea un nuevo producto para recargar la lista automáticamente
    this.sub = this.productService.productoCreado$.subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada = cat;
  }

  // Getter que filtra la lista de productos actual en tiempo real
get productosFiltrados(): Product[] {
    if (this.categoriaSeleccionada === 'todos') {
      return this.products;
    }

    const palabrasBuscadas = this.palabrasClaveCategorias[this.categoriaSeleccionada] || [];

    return this.products.filter(product => {
      const p = product as any;
      const nombre = (p.name || p.nombre || '').toLowerCase();
      const descripcion = (p.description || p.descripcion || '').toLowerCase();

      return palabrasBuscadas.some(palabra =>
        nombre.includes(palabra) || descripcion.includes(palabra)
      );
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}