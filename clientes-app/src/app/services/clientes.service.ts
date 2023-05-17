import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private urlEndpoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  /* Get para get sin paginar
  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndpoint).pipe(
      tap((response) => {
        let clientes = response as Cliente[];
        console.log('ClientesService: tap 1')
        clientes.forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response) => {
        let clientes = response as Cliente[];
        return clientes.map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          /*
          cliente.createAt = formatDate(
            cliente.createAt,
            'EEEE dd, MMMM yyyy',
            'es-CO'
          );

          return cliente;
        });
      }),
      tap((response) => {
        console.log('ClientesService: tap 2')
        response.forEach((response) => {
          console.log(response.nombre);
        });
      })
    );
  }*/

  //Get como paginable
  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClientesService: tap 1');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          /*
          cliente.createAt = formatDate(
            cliente.createAt,
            'EEEE dd, MMMM yyyy',
            'es-CO'
          );*/

          return cliente;
        });
        return response;
      }),
      tap((response) => {
        console.log('ClientesService: tap 2');
        (response.content as Cliente[]).forEach((response) => {
          console.log(response.nombre);
        });
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndpoint, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }

          console.error(e.error.mensaje);
          Swal.fire('Error al crear el cliente', e.error.mensaje, 'error');
          return throwError(() => e);
        })
      );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndpoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        })
      );
  }

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id.toString());

    //COnfigurar barra de progreso
    const req = new HttpRequest(
      'POST',
      `${this.urlEndpoint}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );
    return this.http.request(req);
  }
}
