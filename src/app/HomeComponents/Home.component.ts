import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [], // Aquí irían módulos como CommonModule si los necesitas
  templateUrl: './Home.component.html',
  styleUrl: './Home.component.css'
})
export class HomeComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  forceClose(menu: HTMLElement, event: Event) {
    event.preventDefault(); // Detiene el salto del '#'

    // 1. Cerramos el menú inmediatamente
    menu.classList.remove('show');

    // 2. Usamos un pequeño retraso para asegurar que no "rebote"
    setTimeout(() => {
      const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
      if (toggler) {
        toggler.classList.add('collapsed');
        toggler.setAttribute('aria-expanded', 'false');
      }

      // Forzamos a que el menú esté oculto si Bootstrap intenta reabrirlo
      menu.style.display = 'none';

      // Restauramos el estilo después de la animación para que pueda volver a abrirse
      setTimeout(() => {
        menu.style.display = '';
      }, 350);
    }, 10);
  }
}

