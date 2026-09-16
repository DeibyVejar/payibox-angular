import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component'; // 1. Importar SpinnerComponent

@Component({
  selector: 'app-admin-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent], // 2. Añadir SpinnerComponent a los imports
  templateUrl: './adminuploadcomponent.component.html',
  styleUrls: ['./adminuploadcomponent.component.css']
})
export class AdminUploadComponent {
  @Output() cerrar = new EventEmitter<void>();
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  cargando: boolean = false; // 3. Estado de carga para evitar ejecuciones duplicadas
  private productService = inject(ProductService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(1)]],
      cantidad: [null, [Validators.required, Validators.min(0)]],
      imagen: [null, Validators.required]
    });
  }

  seleccionarCategoria(cat: string) {
    this.form.patchValue({ categoria: cat });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ imagen: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  enviar() {
    // Protección contra clics múltiples si la solicitud ya está en curso
    if (this.cargando) return;

    if (this.form.valid) {
      const formData = new FormData();

      const categoriaKey = (this.form.value.categoria || '').trim().toLowerCase();
      const catMap: { [key: string]: number } = {
        'suplementos': 1,
        'accesorios': 2,
        'ropa': 3
      };

      const categoryId = catMap[categoriaKey];

      if (!categoryId) {
        console.error('Categoría no válida:', this.form.value.categoria);
        alert('Por favor selecciona una categoría válida.');
        return;
      }

      // Activar spinner antes de enviar a la API
      this.cargando = true;

      formData.append('name', this.form.value.nombre);
      formData.append('price', this.form.value.precio);
      formData.append('stock', this.form.value.cantidad);
      formData.append('image', this.form.value.imagen);
      formData.append('category_id', categoryId.toString());
      formData.append('description', 'Sin descripción');

      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.cargando = false;
          alert('¡Producto subido con éxito!');
          this.cerrar.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.cargando = false; // Desactivar spinner si falla para reintentar
          console.error('Error del servidor:', err);
          alert('Error al subir el producto. Revisa la consola.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}