import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-overlay">
      <div class="spinner-container">
        <!-- Tu logo con animación de pulso -->
        <img src="/images/payiboxlogo2.png" alt="Cargando..." class="spinner-logo">
        <!-- Anillo de carga giratorio -->
        <div class="spinner-ring"></div>
      </div>
      <p class="text-warning mt-3 fw-bold tracking-wider">CARGANDO...</p>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(15, 15, 15, 0.85);
      backdrop-filter: blur(5px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner-container {
      position: relative;
      width: 90px;
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .spinner-logo {
      width: 45px;
      height: 45px;
      object-fit: contain;
      animation: pulseLogo 1.5s infinite ease-in-out;
    }

    .spinner-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 3px solid rgba(255, 193, 7, 0.15);
      border-top: 3px solid #ffc107;
      border-radius: 50%;
      animation: spinRing 1s linear infinite;
    }

    @keyframes spinRing {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes pulseLogo {
      0%, 100% { 
        transform: scale(0.95); 
        opacity: 0.7; 
      }
      50% { 
        transform: scale(1.1); 
        opacity: 1; 
        filter: drop-shadow(0 0 12px rgba(255, 193, 7, 0.7)); 
      }
    }
  `]
})
export class SpinnerComponent {}