import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adminuploadcomponent.component.html',
  styleUrls: ['./adminuploadcomponent.component.css']
})
export class AdminUploadComponent {
  @Output() cerrar = new EventEmitter<void>();
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
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
    if (this.form.valid) {
      const formData = new FormData();

      // Normalizamos a minúsculas y limpiamos espacios para evitar conflictos de mapeo
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

      formData.append('name', this.form.value.nombre);
      formData.append('price', this.form.value.precio);
      formData.append('stock', this.form.value.cantidad);
      formData.append('image', this.form.value.imagen);
      formData.append('category_id', categoryId.toString());
      formData.append('description', 'Sin descripción');

      this.productService.createProduct(formData).subscribe({
        next: () => {
          alert('¡Producto subido con éxito!');
          this.cerrar.emit();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error del servidor:', err);
          alert('Error al subir el producto. Revisa la consola.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}