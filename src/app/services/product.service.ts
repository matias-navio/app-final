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

    const url = `${this.url}/todos`;
    return this._http.get<Product[]>(url);
  }

  editarProducto(prductId: number, product: Product): Observable<Product>{

    const url = `${this.url}/modificar`;
    return this._http.put<Product>(`${url}/${prductId}`, product);
  }

  crearProducto(producto: Product): Observable<Product> {

    const url = `${this.url}/crear`;
    return this._http.post<Product>(`${url}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {

    return this._http.delete<void>(`${this.url}/eliminar/${id}`);
  }
}
