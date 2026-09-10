import { Injectable, signal, computed } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: Category;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {

    getItems() {
    return this.cartItems();
  }


  private cartItems = signal<Product[]>([]); 

  // Selectores reactivos para la Navbar y el Carrito
  items = computed(() => this.cartItems());
  totalItems = computed(() => this.cartItems().reduce((prev, curr) => prev + curr.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((prev, curr) => prev + (curr.price * curr.quantity), 0));

  // En car.services.ts
addToCart(product: Product) {
  this.cartItems.update(items => {
    const index = items.findIndex(i => i.id === product.id);
    if (index === -1) {
      // Si es nuevo, lo añadimos con cantidad 1
      return [...items, { ...product, quantity: 1 }];
    } else {
      // Si ya existe, creamos un nuevo array con la cantidad aumentada
      const newItems = [...items];
      newItems[index] = { ...newItems[index], quantity: newItems[index].quantity + 1 };
      return newItems;
    }
  });
}

 // src/app/services/car.services.ts

  // Actualiza la cantidad (asegurando un mínimo de 1)
  updateQuantity(productId: number, change: number) {
    this.cartItems.update(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  }

  // Elimina un producto específico
  removeItem(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  // Vacía todo el carrito
  clearCart() {
    this.cartItems.set([]);
  }
} 



