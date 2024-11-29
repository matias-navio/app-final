import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  selectedProduct: Product | null = null;
  productForm! : FormGroup;
  products: Product[] = [];
  private productSubscripcion : Subscription | undefined;
  errorMessage: string = 'No hay productos disponibles.';
  isEditing: boolean = false;

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
      error: (err) => {
        console.error(err);
        // Mensaje de error en caso de fallo en la API.
        this.errorMessage = 'Error al obtener los productos: ' + err.message;
      }
    });
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product }; // Crear una copia para evitar cambios en tiempo real
    this.isEditing = true;
  }

  saveProduct(): void {
    if (this.selectedProduct) {
      this.productService
        .editarProducto(this.selectedProduct.id, this.selectedProduct)
        .subscribe(
          (updatedProduct) => {
            // Actualizar la lista de productos localmente
            const index = this.products.findIndex((p) => p.id === updatedProduct.id);
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
            this.cancelEditing();
          },
          (error) => {
            console.error('Error al actualizar el producto:', error);
          }
        );
    }
  }

  cancelEditing(): void {
    this.selectedProduct = null;
    this.isEditing = false;
  }
}
