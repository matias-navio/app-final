import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products = [
    {
      id: 1,
      name: 'Camisa',
      price: 2000
    },
    {
      id: 2,
      name: 'Jeans',
      price: 2200
    },
    {
      id: 3,
      name: 'Zapatillas',
      price: 2500
    }
  ]
}
