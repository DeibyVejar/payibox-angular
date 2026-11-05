import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CartService, Product } from '../services/car.services';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Store.component.html',
  styleUrl: './Store.component.css'
})
export class StoreComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private sub: Subscription = new Subscription();
  private http = inject(HttpClient);

  // Control de usuario y modal
  public isAdmin: boolean = false;
  public nuevaCategoriaNombre: string = '';

  // Control de filtros
  public categoriaSeleccionada: string = 'todos';
  public categorias: string[] = ['todos'];

  cartService = inject(CartService);
  productService = inject(ProductService);

  ngOnInit(): void {
    this.checkUserRole();
    this.loadCategories();
    this.loadProducts();

    // Escuchar si se crea un nuevo producto para recargar la lista automáticamente
    this.sub = this.productService.productoCreado$.subscribe(() => {
      this.loadProducts();
      this.loadCategories();
    });
  }

  checkUserRole(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = user.role === 'admin' || user.is_staff === true;
  }

  loadCategories(): void {
    this.http.get<any[]>('https://payiboxgym.pythonanywhere.com/api/products/categories/').subscribe({
      next: (data) => {
        const nombresApi = data.map(c => c.name.toLowerCase());
        this.categorias = ['todos', ...Array.from(new Set(nombresApi))];
      },
      error: () => {
        // Respaldo de categorías base en caso de error o desarrollo offline
        this.categorias = ['todos', 'franelas', 'shorts', 'faldas', 'accesorios'];
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  crearCategoria(): void {
    if (!this.nuevaCategoriaNombre.trim()) return;

    const nuevaCat = this.nuevaCategoriaNombre.trim();

    // 1. Obtención robusta del Token (Busca en 'access', 'token' o dentro de 'user')
    let token = localStorage.getItem('access') || localStorage.getItem('token');
    if (!token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          token = parsedUser.token || parsedUser.access;
        } catch (e) {
          console.error('Error al obtener token del objeto user:', e);
        }
      }
    }

    // 2. Construcción de encabezados con autorización Bearer
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // 3. Petición POST a la API
    this.http.post('https://payiboxgym.pythonanywhere.com/api/products/categories/', {
      name: nuevaCat
    }, { headers }).subscribe({
      next: (res: any) => {
        const catNombre = (res.name || nuevaCat).toLowerCase();
        if (!this.categorias.includes(catNombre)) {
          this.categorias.push(catNombre);
        }
        this.nuevaCategoriaNombre = '';

        // Cerrar modal automáticamente
        const btnCerrar = document.getElementById('cerrarModalCat');
        if (btnCerrar) btnCerrar.click();
      },
      error: (err) => {
        console.error('Error al crear la categoría:', err);
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada = cat;
  }

  // Getter que filtra los productos dinámicamente por la categoría seleccionada
  get productosFiltrados(): Product[] {
    if (this.categoriaSeleccionada === 'todos') {
      return this.products;
    }

    return this.products.filter(product => {
      const p = product as any;
      const catNombre = (p.category?.name || p.category || '').toLowerCase();
      const prodNombre = (p.name || p.nombre || '').toLowerCase();

      return catNombre === this.categoriaSeleccionada.toLowerCase() || prodNombre.includes(this.categoriaSeleccionada.toLowerCase());
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}