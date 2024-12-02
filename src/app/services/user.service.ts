import { inject, Injectable } from '@angular/core';
import { User } from '../user/model/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  listaProductos: User[] = [];
  private readonly _http = inject(HttpClient);
  private url = 'http://localhost:8080/api/empleados';

  getUsers(): Observable<User[]>{

    const url = `${this.url}/todos`;
    return this._http.get<User[]>(url);
  }

  editarUser(userId: number, user: User): Observable<User>{

    const url = `${this.url}/modificar`;
    return this._http.put<User>(`${url}/${userId}`, user);
  }

  crearUser(user: User): Observable<User> {

    const url = `${this.url}/crear`;
    return this._http.post<User>(`${url}`, user);
  }

  eliminarUser(id: number): Observable<void> {

    return this._http.delete<void>(`${this.url}/eliminar/${id}`);
  }
}
