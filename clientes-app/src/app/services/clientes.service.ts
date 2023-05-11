import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { CLIENTES } from '../clientes/clientes.json';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private urlEndpoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    return this.http
      .get(this.urlEndpoint)
      .pipe(map((response) => response as Cliente[]));
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndpoint, cliente, {
      headers: this.httpHeaders,
    });
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.urlEndpoint}/${cliente.id}`,
      cliente,
      {
        headers: this.httpHeaders,
      }
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`, {
      headers: this.httpHeaders,
    });
  }
}
