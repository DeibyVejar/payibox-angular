import { Injectable, signal, computed } from '@angular/core';

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

// ✨ Nueva interfaz que asegura que en el carrito siempre exista 'quantity'
export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  getItems() {
    return this.cartItems();
  }

  // ✨ El Signal ahora maneja CartItem[] en lugar de Product[]
  private cartItems = signal<CartItem[]>([]); 

  items = computed(() => this.cartItems());
  totalItems = computed(() => this.cartItems().reduce((prev, curr) => prev + curr.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((prev, curr) => prev + (curr.price * curr.quantity), 0));

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