import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'https://payiboxgym.pythonanywhere.com/api/orders';

  private getAuthHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
  }

  createOrder(data: any) {
    return this.http.post(`${this.apiUrl}/`, data, { headers: this.getAuthHeaders() });
  }

  uploadReceipt(id: number, formData: FormData) {
    // Nota: Para FormData no se debe enviar el header 'Content-Type: application/json'
    return this.http.patch(`${this.apiUrl}/${id}/`, formData, { headers: this.getAuthHeaders() });
  }

  updateOrderStatus(id: number, status: string) {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.patch(`${this.apiUrl}/${id}/`, { status }, { headers });
  }

  getMyOrders() {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getAuthHeaders() });
  }
}