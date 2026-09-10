import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  
  // 🔗 Cambia esta URL por la ruta real de tu API de Django para usuarios
  private apiUrl = 'https://payiboxgym.pythonanywhere.com/api/users/'; 

  // Obtener la lista de usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Actualizar los datos o rol de un usuario
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }

  // Eliminar/Dar de baja un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}