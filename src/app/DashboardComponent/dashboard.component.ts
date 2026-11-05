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
generarReportePDF(tipo: 'diario' | 'mensual') {
  const doc = new jsPDF();
  const fechaHoy = new Date().toLocaleDateString();

  // 1. Título y encabezado
  doc.setFillColor(24, 24, 27); // #18181b (Fondo oscuro)
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 193, 7); // #ffc107 (Texto amarillo)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYIBOX GYM', 14, 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const tituloReporte = tipo === 'diario' 
    ? `REPORTE DIARIO DE VENTAS (${fechaHoy})` 
    : `REPORTE MENSUAL DE VENTAS`;
  doc.text(tituloReporte, 14, 23);

  // 2. Resumen de Métricas
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Pedidos Hoy: ${this.resumen.ventas_hoy_count || 0}`, 14, 42);
  doc.text(`Pedidos del Mes: ${this.resumen.ventas_mes_count || 0}`, 120, 42);

  doc.setFontSize(13);
  const subtituloTabla = tipo === 'diario' 
    ? 'Productos Vendidos El Día de Hoy' 
    : 'Ranking de Productos Más Vendidos del Mes';
  doc.text(subtituloTabla, 14, 55);

  // 3. Filtrar datos según el tipo de reporte
  // Si es diario y las ventas del día son 0, generamos la fila de "Sin ventas"
  let bodyData: any[] = [];

  if (tipo === 'diario' && this.resumen.ventas_hoy_count === 0) {
    bodyData = [
      [{ content: 'No se registraron ventas en el día de hoy.', colSpan: 4, styles: { halign: 'center', textColor: [120, 120, 120] } }]
    ];
  } else {
    bodyData = this.topProductos.map((item, index) => [
      `#${index + 1}`,
      item.product__name,
      `${item.total_vendido} uds.`,
      `$${Number(item.ingresos_totales).toLocaleString('es-CO')} COP`
    ]);
  }

  // 4. Construcción de la tabla con autoTable
  autoTable(doc, {
    startY: 60,
    head: [['Posición', 'Producto', 'Unidades Vendidas', 'Ingresos Generados']],
    body: bodyData,
    headStyles: {
      fillColor: [255, 193, 7],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    }
  });

  // 5. Guardar el archivo generado
  const timeStamp = new Date().getTime();
  doc.save(`Reporte_Payibox_${tipo}_${timeStamp}.pdf`);
}}