import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  selectedProduct: Product | null = null;
  productForm!: FormGroup;
  products: Product[] = [];
  private productSubscripcion : Subscription | undefined;
  errorMessage: string = 'No hay productos disponibles.';

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
}
