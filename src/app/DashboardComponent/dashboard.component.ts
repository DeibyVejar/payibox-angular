import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  public topProductos: any[] = [];
  public resumen: any = {};
  public cargando: boolean = true;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.http.get<any>('https://payiboxgym.pythonanywhere.com/api/users/dashboard-stats/').subscribe({
      next: (res) => {
        this.topProductos = res.top_productos || [];
        this.resumen = res.resumen || {};
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas del dashboard:', err);
        this.cargando = false;
      }
    });
  }

  // GENERACIÓN DE REPORTES EN PDF
  generarReportePDF(tipo: 'diario' | 'mensual'): void {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const tituloReporte = tipo === 'diario'
      ? `REPORTE DIARIO DE VENTAS (${fechaActual})`
      : `REPORTE MENSUAL DE VENTAS (${new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()})`;

    // Encabezado con estética Payibox
    doc.setFillColor(24, 24, 27); // #18181b
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 193, 7); // Amarillo Payibox (#ffc107)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYIBOX GYM', 14, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(tituloReporte, 14, 25);

    // Métricas del Resumen
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pedidos Hoy: ${this.resumen.ventas_hoy_count || 0}`, 14, 40);
    doc.text(`Pedidos del Mes: ${this.resumen.ventas_mes_count || 0}`, 110, 40);

    // Tabla de Productos Más Vendidos
    doc.setFontSize(12);
    doc.text('Ranking de Productos Más Vendidos', 14, 52);

    const filasTabla = this.topProductos.map((p, index) => [
      `#${index + 1}`,
      p.product__name || 'Producto',
      `${p.total_vendido} uds.`,
      `$${p.ingresos_totales ? p.ingresos_totales.toLocaleString() : 0} COP`
    ]);

    autoTable(doc, {
      startY: 57,
      head: [['Posición', 'Producto', 'Unidades Vendidas', 'Ingresos Generados']],
      body: filasTabla,
      headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid'
    });

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Este documento es un reporte oficial generado automáticamente por la plataforma Payibox.', 14, doc.internal.pageSize.height - 10);

    doc.save(`Reporte_Payibox_${tipo}_${Date.now()}.pdf`);
  }
}