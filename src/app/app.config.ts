import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// 1. IMPORTANTE: Agrega withInterceptors a esta lista
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    // 2. Unifica todo aquí en una sola llamada
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor])
    ) 
  ]
};