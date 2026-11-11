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
    { 
      titulo: "Gimnasio del año!", 
      texto: "Fuimos reconocidos como el mejor espacio de entrenamiento de la región gracias a nuestras instalaciones de primer nivel, un ambiente inigualable y el compromiso inquebrantable con los resultados de nuestros socios. Tu esfuerzo diario es nuestro mayor premio.", 
      icono: "bi-trophy", 
      imagen: "images/bestgym.jpg" 
    },
    { 
      titulo: "Sala de spinning!", 
      texto: "Contamos con una zona exclusiva y climatizada, equipada con bicicletas de última generación. Nuestras clases guiadas te harán quemar calorías, mejorar tu resistencia cardiovascular y llevar tu ritmo cardíaco al máximo con la mejor energía.", 
      icono: "bi-bicycle", 
      imagen: "images/spinning.jpg" 
    },
    { 
      titulo: "Entrenamos atletas de alto rendimiento!", 
      texto: "No solo somos un espacio para entrenar, somos una cuna de campeones. Diseñamos programas específicos de fuerza, potencia y acondicionamiento para deportistas exigentes que buscan romper sus propios límites y dominar en su disciplina.", 
      icono: "bi-activity", 
      imagen: "images/elite.jpg" 
    }
  ];

  abrirDetalle(index: number) {
    this.hitoSeleccionado = index;
    this.detalleAbierto = true;
  }

  cerrarDetalle() {
    this.detalleAbierto = false;
  }
}