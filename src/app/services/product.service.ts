import { inject, Injectable } from '@angular/core';
import { Product } from "../products/model/product"
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  listaProductos: Product[] = [];
  private readonly _http = inject(HttpClient);
  private url = 'http://localhost:8080/api/productos';

  getProducts(): Observable<Product[]>{

    const url = `${this.url}/todos`; // Construcción de la URL completa
    return this._http.get<Product[]>(url);
  }

  editarProducto(prductId: number, product: Product): Observable<Product>{
    
    return this._http.put<Product>(`${this.url}/${prductId}`, product);
  }
}
