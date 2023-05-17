import { ClientesService } from './../services/clientes.service';
import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css'],
})
export class DetalleClienteComponent implements OnInit {
  @Input() cliente: Cliente;
  public titulo: string = 'Detalle Cliente';
  public fotoSeleccionada!: File | null;
  public progreso: number = 0;

  constructor(
    private clienteService: ClientesService,
    public modalService: ModalService
  ) {
    this.cliente = new Cliente(0, '', '', '', '', '');
  }
  ngOnInit(): void {
    //Se crea observable que monitora la ruta (paramMap) para capturar el id
    /* this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = +params.get('id')! | 0;

      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });*/
  }

  //Seleccionar foto
  public seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (
      this.fotoSeleccionada !== null &&
      this.fotoSeleccionada.type.indexOf('image') < 0
    ) {
      Swal.fire(
        'Error Seleccionar imagen: ',
        'El archivo debe ser del tipo imagen',
        'error'
      );
      this.fotoSeleccionada = null;
    }
  }

  public subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService
        .subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe((event) => {
          //Barra de progreso
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round(
              (event.loaded / (event.total ?? 1)) * 100
            );
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            
            //Actualizar imagen tan pronto se sube 
            this.modalService.notificarUpload.emit(this.cliente);

            
            Swal.fire(
              'La foto se ha subido completamente!',
              response.mensaje,
              'success'
            );
          }
        });
    }
  }

  public cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
