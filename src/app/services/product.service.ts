import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; // Combinamos las importaciones
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://payiboxgym.pythonanywhere.com/api/products/';

  // 1. Creamos el Subject para notificar cambios
  private productoCreado = new Subject<void>();
  productoCreado$ = this.productoCreado.asObservable();

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  // 2. Modificamos el método para disparar el aviso (tap)
  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap(() => this.productoCreado.next())
    );
  }
}