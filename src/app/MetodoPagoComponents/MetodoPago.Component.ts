import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/car.services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-metodo-pago',
  templateUrl: './MetodoPago.Component.html',
  styleUrls: ['./MetodoPago.Component.css']
})
export class MetodoPagoComponent {
  productos: any;
  archivoSeleccionado: File | null = null;
  selectedBank: string = '';
  numeroNota: string = '';
  orderNumber: string = ''; 
  view: string = 'menu';

  cuentas: any = {
    'bancolombia': { numero: '123456789', titular: 'Juan Perez' },
    'nacional': { numero: '987654321', titular: 'Empresa XYZ' }
  };

  // Constructor único y corregido
  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {
    this.productos = this.cartService.items;
  }

  // Obtenemos el titular desde el objeto que ya tienes en localStorage
  get nombreTitular(): string {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Si no tienes 'name', usamos 'email' que sí aparece en tu consola
        return user.name || user.email || 'Usuario';
      } catch (e) {
        return 'Usuario';
      }
    }
    return 'Usuario';
  }

  seleccionarMetodo(metodo: string) {
    this.selectedBank = metodo;
    this.view = 'transferencia';
    this.orderNumber = 'ORD-' + Date.now().toString().slice(-8);
  }

  async procesarCompra() {
    // 1. Validar obligatoriedad del archivo en transferencias
  if (this.selectedBank !== 'efectivo' && !this.archivoSeleccionado) {
    Swal.fire('Atención', 'Por favor, adjunta el comprobante de pago para continuar.', 'warning');
    return; // Detiene la ejecución aquí
  }

  Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const orderData = {
      payment_method: this.selectedBank === 'efectivo' ? 'cash' : 'transfer',
      transfer_reference: this.selectedBank === 'efectivo' ? this.orderNumber : this.numeroNota,
      titular: this.nombreTitular,
      order_number: this.orderNumber,
      items: this.productos().map((p: any) => ({
        product: p.id,
        quantity: p.quantity,
        price: p.price
      }))
    };

    try {
      const orderRes: any = await firstValueFrom(this.orderService.createOrder(orderData));
      
      if (this.selectedBank !== 'efectivo' && this.archivoSeleccionado) {
        const formData = new FormData();
        formData.append('transfer_image', this.archivoSeleccionado);
        await firstValueFrom(this.orderService.uploadReceipt(orderRes.id, formData));
      }

      Swal.fire('¡Éxito!', `Compra #${this.orderNumber} registrada.`, 'success');
      this.cartService.clearCart();
      this.router.navigate(['/perfil']);
    } catch (err: any) {
      Swal.fire('Error', 'No se pudo completar el proceso.', 'error');
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

  volver() {
    this.view = 'menu';
    this.selectedBank = '';
  }
}