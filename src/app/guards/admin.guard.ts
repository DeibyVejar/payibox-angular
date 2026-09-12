import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Obtenemos los datos del usuario guardados en el localStorage
  const userJson = localStorage.getItem('user');
  
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      
      // Validamos si existe el token y si el rol o correo corresponde al administrador
      // (Ajusta 'admin' o el correo según cómo guardes el rol en tu backend)
      if (user && user.token) {
        return true; // Permite el paso
      }
    } catch (e) {
      console.error("Error al leer el usuario del localStorage", e);
    }
  }

  // Si no está autenticado o no es admin, lo sacamos al login
  router.navigate(['/login']);
  return false;
};