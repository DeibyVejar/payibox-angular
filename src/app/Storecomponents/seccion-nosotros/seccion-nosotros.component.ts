import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Hito {
  titulo: string;
  texto: string;
  icono: string; // Clase de Bootstrap Icon
  imagen: string;
}

@Component({
  selector: 'app-seccion-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seccion-nosotros.component.html',
  styleUrls: ['./seccion-nosotros.component.css']
})
export class SeccionNosotrosComponent {
  detalleAbierto: boolean = false;
  hitoSeleccionado: number = 0;

  hitos: Hito[] = [
    { titulo: "El Origen", texto: "Payibox comenzó con un simple objetivo: eliminar las barreras entre tú y tu mejor versión. En un pequeño garaje, entendimos que el equipo adecuado no solo mejora el rendimiento, sino que forja la disciplina necesaria para alcanzar cualquier meta física.", icono: "bi-house", imagen: "images/aboutus.png" },
    { titulo: "La Comunidad", texto: "Lo que nació como una tienda se transformó en un movimiento. Hemos sido testigos de miles de historias de superación donde el sudor, la constancia y el equipo de Payibox fueron los protagonistas.", icono: "bi-people", imagen: "images/aboutus.png" },
    { titulo: "Payibox Hoy", texto: "Hoy integramos tecnología avanzada y diseño funcional para ofrecerte una experiencia de compra sin igual. Seguimos innovando en suplementación y accesorios, porque tu compromiso no descansa.", icono: "bi-lightning", imagen: "images/aboutus.png" }
  ];

  abrirDetalle(index: number) {
    this.hitoSeleccionado = index;
    this.detalleAbierto = true;
  }

  cerrarDetalle() {
    this.detalleAbierto = false;
  }
}