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

  // 1. Inicialización inmediata desde localStorage normalizando el objeto
  public currentUser = signal<any>(this.getUserFromStorage());

  private getUserFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          return this.normalizeUser(parsed);
        } catch (e) {
          console.error('Error al parsear el usuario almacenado:', e);
          return null;
        }
      }
    }
    return null;
  }

  // 2. Normaliza la estructura para que email, role y demás campos estén en la raíz
  private normalizeUser(userData: any) {
    if (!userData) return null;

    const details = userData.user || userData;
    const email = details.email || userData.email || '';
    const username = details.username || (email ? email.split('@')[0] : '');
    const isAdmin = details.is_admin === true || email.toLowerCase().trim() === 'admin@gmail.com';

    return {
      ...userData,
      ...details,
      email: email,
      username: username,
      role: isAdmin ? 'admin' : 'user',
      is_admin: isAdmin
    };
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/register/`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}users/login/`, credentials).pipe(
      tap(response => {
        if (response) {
          this.setUser(response); 
        }
      })
    );
  }

  setUser(userData: any) {
    const normalizedUser = this.normalizeUser(userData);

    // Guardamos el objeto plano en el Signal y en localStorage
    this.currentUser.set(normalizedUser);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      if (normalizedUser?.access) {
        localStorage.setItem('access', normalizedUser.access);
      }
    }
  }

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('access');
      localStorage.removeItem('access_token');
    }
  }
}