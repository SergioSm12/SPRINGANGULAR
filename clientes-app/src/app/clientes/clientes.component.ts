import { Cliente } from './../models/cliente';
import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../services/clientes.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  public clientes: Cliente[] = [];
  public paginador: any;
  public clienteSeleccionado: Cliente;

  constructor(
    private clienteService: ClientesService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.clienteSeleccionado = new Cliente(0, '', '', '', '', '');
  }

  ngOnInit() {
    //Creamos observador que capture el parametro page de la ruta
    this.activatedRoute.paramMap.subscribe((params) => {
      //Casteo de la variable que llega como string
      let page: number = +params.get('page')! | 0;

      //validamos si page no llega
      if (!page) {
        page = 0;
      }
      this.clienteService
        .getClientes(page)
        .pipe(
          tap((response) => {
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach((cliente) => {
              console.log(cliente.nombre);
            });
          })
        )
        .subscribe((response) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    //MOnitoramos para actualizar imagen

    this.modalService.notificarUpload.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-outline-info',
        cancelButton: 'btn btn-outline-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estas Seguro?',
        text: `¿Estas seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Cliente eliminado',
              `Cliente ${cliente.nombre} eliminado con éxito`,
              'success'
            );
          });
        }
      });
  }

  public abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
