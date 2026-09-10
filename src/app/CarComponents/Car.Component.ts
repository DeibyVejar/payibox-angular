import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/car.services';
import { MetodoPagoComponent } from '../MetodoPagoComponents/MetodoPago.Component';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, MetodoPagoComponent, RouterModule],
  templateUrl: './Car.Component.html'
})
export class CartComponent {
  public cartService = inject(CartService);

  abrirModal() {
    const modalElement = document.getElementById('paymentModal');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    }
  }
}