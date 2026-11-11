import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { OrderService } from '../services/order.service'; // Ajusta según tu estructura
import { AuthService } from '../services/auth.service';   // Ajusta según tu estructura

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './Perfil.Component.html',
  styleUrls: ['./Perfil.Component.css']
})
export class PerfilComponent implements OnInit {
  private orderService = inject(OrderService);
  public authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  public pedidosLocales: any[] = [];
  public formInputs: any = { username: '', email: '', password: '', avatar: '' };
  public isAdmin: boolean = false;
  
  // Flag para controlar el estado de carga y evitar el FOUC / destello
  public cargandoPedidos: boolean = true;

  // ==========================================
  // VARIABLES DE PAGINACIÓN (NUEVO)
  // ==========================================
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5; // Cambia este valor para mostrar más o menos tarjetas
  public pedidosPaginados: any[] = []; 

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.limpiarFondoOscuro();

      // Obtenemos el usuario de manera reactiva desde AuthService
      const user = this.authService.currentUser();

      if (!user) {
        this.router.navigate(['/']);
        return;
      }

      // Definimos el rol basándonos en el AuthService
      this.isAdmin = user?.role === 'admin';

      // Adaptación de nombre para la UI
      this.formInputs.username = user.first_name ? `${user.first_name} ${user.last_name}` : (user.username || '');
      this.formInputs.email = user.email || '';

      this.cargarPedidos();
    }
  }

  // FUNCIÓN PARA MATAR EL BACKDROP DE BOOTSTRAP
  private limpiarFondoOscuro() {
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop, .offcanvas-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 50);
  }

  cargarPedidos() {
    this.cargandoPedidos = true;

    this.orderService.getMyOrders().pipe(take(1)).subscribe({
      next: (data: any) => {
        this.pedidosLocales = data;
        this.inicializarPaginacion(); // ✨ Iniciamos la paginación aquí
        this.cargandoPedidos = false; 
      },
      error: (err: any) => {
        console.error("Error al cargar pedidos:", err);
        this.cargandoPedidos = false; 
      }
    });
  }

  // ==========================================
  // MÉTODOS DE PAGINACIÓN (NUEVO)
  // ==========================================
  
  inicializarPaginacion() {
    this.paginaActual = 1;
    this.actualizarVistaPaginada();
  }

  actualizarVistaPaginada() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.pedidosPaginados = this.pedidosLocales.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarVistaPaginada();
      
      // Scroll suave hacia la parte superior del contenedor de pedidos
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.pedidosLocales.length / this.itemsPorPagina);
  }

  // ==========================================
  // RESTO DE LOS MÉTODOS (SIN CAMBIOS)
  // ==========================================

  verComprobante(pedido: any) {
    if (pedido.transfer_image) {
      window.open(pedido.transfer_image, '_blank');
    } else {
      alert('Este pedido no tiene un comprobante de pago adjunto.');
    }
  }

  verFactura(pedido: any): void {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("PAYIBOX GYM", 14, 20);

    doc.setFontSize(10);
    doc.text(`NOTA: PBX-${pedido.id}`, 14, 28);
    const fecha = pedido.created_at ? new Date(pedido.created_at).toLocaleDateString() : 'N/A';
    doc.text(`FECHA: ${fecha}`, 14, 33);
    doc.line(14, 38, 196, 38);

    const columnas = [["ARTÍCULO", "CANTIDAD", "PRECIO"]];
    const filas = pedido.items.map((item: any) => [
      item.product_name || 'Producto',
      item.quantity,
      `$${parseFloat(item.price).toFixed(2)}`
    ]);

    (autoTable as any)(doc, {
      head: columnas,
      body: filas,
      startY: 45,
      headStyles: { fillColor: [41, 128, 185] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`TOTAL PAGADO: $${parseFloat(pedido.total).toFixed(2)}`, 14, finalY);
    doc.save(`Factura_PBX-${pedido.id}.pdf`);
  }

  traducirMetodoPago(metodo: string): string {
    if (!metodo) return 'No especificado';
    const m = metodo.toUpperCase();
    if (m === 'TRANSFER') return 'Transferencia';
    if (m === 'CASH') return 'Efectivo';
    return metodo;
  }

  traducirEstado(estado: string): string {
    if (!estado) return 'Pendiente';
    const e = estado.toLowerCase();
    if (e === 'pending') return 'Pendiente';
    if (e === 'confirmed') return 'Confirmado';
    if (e === 'rejected') return 'Rechazado';
    return 'Pendiente';
  }

  actualizarPerfil() { }
  onAvatarChange(e: any) { }

  cambiarEstado(pedido: any, event: any) {
    const nuevoEstado = event.target.value;

    this.orderService.updateOrderStatus(pedido.id, nuevoEstado).subscribe({
      next: (response) => {
        // Actualizamos el estado tanto en el objeto local paginado como en el array principal
        pedido.status = nuevoEstado; 
        
        // (Opcional) Sincronizar explícitamente el array principal si es necesario
        const index = this.pedidosLocales.findIndex(p => p.id === pedido.id);
        if (index !== -1) {
            this.pedidosLocales[index].status = nuevoEstado;
        }

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Estado actualizado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el estado.'
        });
      }
    });
  }
}