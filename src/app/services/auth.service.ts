import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://payiboxgym.pythonanywhere.com/api/'; 
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  // Signal para el usuario con persistencia
  public currentUser = signal<any>(this.getUserFromStorage());

private getUserFromStorage() {
  if (isPlatformBrowser(this.platformId)) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      const userDetails = userObj?.user || userObj;
      const identificador = userDetails.username || userDetails.email;

      if (userDetails.is_admin === true || identificador?.toLowerCase().trim() === 'admin@gmail.com') {
        userObj.role = 'admin';
      } else {
        userObj.role = 'user';
      }
      return userObj;
    }
  }
  return null;
}
  // --- MÉTODO DE REGISTRO (Faltaba en tu última versión) ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/register/`, userData);
  }

  // --- MÉTODO DE LOGIN ---
login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}users/login/`, credentials).pipe(
      tap(response => {
        // Importante: Pasamos la 'response' completa (que contiene el objeto user)
        // para que setUser pueda encontrar el email donde sea que esté.
        if (response) {
          this.setUser(response); 
        }
      })
    );
  }

setUser(userData: any) {
  // 1. Extraemos los datos del usuario (buscando en username o email)
  const userDetails = userData?.user || userData;
  const identificador = userDetails.username || userDetails.email;
  
  // 2. Lógica basada en tu modelo de Django
  // Priorizamos is_admin, pero validamos también el username
  if (userDetails.is_admin === true || identificador?.toLowerCase().trim() === 'admin@gmail.com') {
    userData.role = 'admin';
  } else {
    userData.role = 'user';
  }

  // 3. Guardamos el objeto ya con el rol correcto
  this.currentUser.set(userData);
  
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
}

  

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    }
  }
}