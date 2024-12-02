import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  selectedProduct: Product | null = null; // producto que se selecciona de la tabla
  productForm! : FormGroup;
  products: Product[] = []; // para poblar la lista de productos
  private productSubscripcion : Subscription | undefined; 
  newProduct: Product = { id: 0, marca: '', precio: 0, tipo: '' }; // estructura para crear un nuevo productos
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService : ProductService
  ){}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(prod => {
        this.products = prod;
      });

    this.productForm = this.formBuilder.group({
      marca: ['', Validators.required],
      precio: ['', Validators.required],
      tipo: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    if(this.productSubscripcion){
      this.productSubscripcion.unsubscribe();
    }
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data; // Si hay datos, se llenan los productos.
      },
    });
  }

  openForm(product?: Product): void {
    if (product) {
      this.selectedProduct = { ...product }; // Clonar producto para evitar modificar el original
      this.isEditMode = true; // Modo edición
    } else {
      this.selectedProduct = { id: 0, marca: '', precio: 0, tipo: '' }; // Valores por defecto
      this.isEditMode = false; // Modo creación
    }
  }

  saveProduct(): void {
    if (!this.selectedProduct) return;

    if (this.isEditMode) {
      // Actualizar producto
      this.productService.editarProducto(this.selectedProduct.id, this.selectedProduct).subscribe({
        next: (updatedProduct) => {
          // verifica que el id seleccionado es igual al del producto de la tabla
          const index = this.products.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          // oculta el formulario una vez actualizado el producto
          this.selectedProduct = null;
          this.isEditMode = false;
        },
      });
    } else {
      // Crear nuevo producto
      this.productService.crearProducto(this.selectedProduct).subscribe({
        next: (createdProduct) => {
          this.products.push(createdProduct);
          this.selectedProduct = null;
        },
      });
    }
  }

  cancelEditing(): void {
    this.selectedProduct = null; // Cierra el formulario
    this.isEditMode = false;
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.eliminarProducto(id).subscribe({
        next: () => {
          // Eliminar el producto de la lista local
          this.products = this.products.filter((product) => product.id !== id);
          console.log('Producto eliminado con éxito');
        },
      });
    }
  }
}
