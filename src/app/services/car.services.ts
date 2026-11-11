import { Injectable, signal, computed, effect } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity?: number;
  category: Category;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  // 1. Inicializar leyendo desde localStorage si existen datos guardados
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  items = computed(() => this.cartItems());
  totalItems = computed(() => this.cartItems().reduce((prev, curr) => prev + curr.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((prev, curr) => prev + (curr.price * curr.quantity), 0));

  constructor() {
    // 2. 'effect' reacciona automáticamente a cualquier cambio en cartItems y lo guarda
    effect(() => {
      localStorage.setItem('payibox_cart', JSON.stringify(this.cartItems()));
    });
  }

  // Método auxiliar para recuperar el carrito almacenado
  private loadCartFromStorage(): CartItem[] {
    try {
      const savedCart = localStorage.getItem('payibox_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  }

  getItems() {
    return this.cartItems();
  }

  // ✨ MÉTODO AUXILIAR NUEVO: Para saber rápido cuántos hay de un ítem en el carrito
  getQuantityInCart(productId: number): number {
    const item = this.cartItems().find(i => i.id === productId);
    return item ? item.quantity : 0;
  }

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const index = items.findIndex(i => i.id === product.id);
      
      if (index === -1) {
        // Si no está en el carrito, verificamos que haya stock en la base de datos
        if (product.stock > 0) {
          return [...items, { ...product, quantity: 1 }];
        }
        return items;
      } else {
        const newItems = [...items];
        // ✨ VALIDACIÓN: Solo suma si la cantidad actual es menor que el stock
        if (newItems[index].quantity < product.stock) {
          newItems[index] = { ...newItems[index], quantity: newItems[index].quantity + 1 };
        }
        return newItems;
      }
    });
  }

  updateQuantity(productId: number, change: number) {
    this.cartItems.update(items =>
      items.map(item =>
        item.id === productId
          // ✨ VALIDACIÓN: Math.max evita que baje de 1, y Math.min evita que pase del stock máximo
          ? { ...item, quantity: Math.min(item.stock, Math.max(1, item.quantity + change)) }
          : item
      )
    );
  }

  removeItem(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}