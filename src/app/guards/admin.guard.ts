import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userJson = localStorage.getItem('user');
  
  // 1. Si ni siquiera está logueado, lo mandamos al login
  if (!userJson) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const user = JSON.parse(userJson);
    
    // 2. Verificamos si el usuario es administrador según los datos de tu backend (Django)
    // (Ajusta 'is_staff' o 'is_superuser' según lo que guardes al iniciar sesión)
    const esAdmin = user.is_staff || user.is_superuser || user.role === 'admin';

    if (user.token && esAdmin) {
      return true; // Permite el acceso al panel de admin
    }
  } catch (e) {
    console.error("Error al validar permisos", e);
  }

  // 3. Si está logueado pero es un usuario común, lo redirigimos a acceso denegado
  router.navigate(['/acceso-denegado']);
  return false;
};