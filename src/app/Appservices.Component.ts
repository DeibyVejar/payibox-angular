import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Lista de productos en el carrito usando Signals para reactividad
  private cartItems = signal<any[]>([]);

  // Método para obtener la lista
  getCart() {
    return this.cartItems;
  }

  // Método para añadir productos
  addToCart(product: any) {
    this.cartItems.update(items => [...items, product]);
    console.log('Carrito actualizado:', this.cartItems());
  }
}