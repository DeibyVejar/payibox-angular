import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // Importar Subscription
import { CartService, Product } from '../services/car.services';
import { ProductService } from '../services/product.service'; // Asegúrate de importar el servicio correcto

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

  cartService = inject(CartService);
  productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();

    // 2. Escuchar si se crea un nuevo producto para recargar la lista automáticamente
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

  ngOnDestroy(): void {
    this.sub.unsubscribe(); // Buena práctica para evitar fugas de memoria
  }
}