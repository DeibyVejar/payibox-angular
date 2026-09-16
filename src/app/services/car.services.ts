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

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const index = items.findIndex(i => i.id === product.id);
      if (index === -1) {
        return [...items, { ...product, quantity: 1 }];
      } else {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], quantity: newItems[index].quantity + 1 };
        return newItems;
      }
    });
  }

  updateQuantity(productId: number, change: number) {
    this.cartItems.update(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
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