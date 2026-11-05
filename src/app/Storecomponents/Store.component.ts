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
    const nombreLimpio = this.nuevaCategoriaNombre.trim();

    if (!nombreLimpio) return;

    // Validar que el nombre contenga texto y no sean solo números
    const contieneLetras = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(nombreLimpio);
    const esSoloNumeros = /^\d+$/.test(nombreLimpio);

    if (esSoloNumeros || !contieneLetras) {
      alert('El nombre de la categoría debe contener letras y no puede estar compuesto solo por números.');
      return;
    }

    const nuevaCat = nombreLimpio;

    // Obtención del token
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

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.post('https://payiboxgym.pythonanywhere.com/api/products/categories/', {
      name: nuevaCat
    }, { headers }).subscribe({
      next: (res: any) => {
        const catNombre = (res.name || nuevaCat).toLowerCase();
        if (!this.categorias.includes(catNombre)) {
          this.categorias.push(catNombre);
        }
        this.nuevaCategoriaNombre = '';

        const btnCerrar = document.getElementById('cerrarModalCat');
        if (btnCerrar) btnCerrar.click();
      },
      error: (err) => {
        console.error('Error al crear la categoría:', err);
        alert('No se pudo guardar la categoría. Revisa tus permisos de usuario.');
      }
    });
  }

  eliminarCategoria(catNombre: string, event: Event): void {
    event.stopPropagation();

    if (catNombre === 'todos') return;

    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${catNombre}"?`)) {
      return;
    }

    this.http.get<any[]>('https://payiboxgym.pythonanywhere.com/api/products/categories/').subscribe({
      next: (categories) => {
        const catObj = categories.find(c => c.name.toLowerCase() === catNombre.toLowerCase());
        
        if (!catObj) {
          this.categorias = this.categorias.filter(c => c !== catNombre);
          return;
        }

        let token = localStorage.getItem('access') || localStorage.getItem('token');
        if (!token) {
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              token = parsedUser.token || parsedUser.access;
            } catch (e) {}
          }
        }

        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }

        this.http.delete(`https://payiboxgym.pythonanywhere.com/api/products/categories/${catObj.id}/`, { headers }).subscribe({
          next: () => {
            this.categorias = this.categorias.filter(c => c !== catNombre);
            if (this.categoriaSeleccionada === catNombre) {
              this.categoriaSeleccionada = 'todos';
            }
          },
          error: (err) => {
            console.error('Error al eliminar la categoría:', err);
            alert('No se pudo eliminar la categoría.');
          }
        });
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada = cat;
  }

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