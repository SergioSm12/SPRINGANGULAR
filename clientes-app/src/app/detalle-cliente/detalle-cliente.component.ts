import { ClientesService } from './../services/clientes.service';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css'],
})
export class DetalleClienteComponent implements OnInit {
  public cliente: Cliente;
  public titulo: string = 'Detalle Cliente';
  public fotoSeleccionada!: File;

  constructor(
    private clienteService: ClientesService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.cliente = new Cliente(0, '', '', '', '', '');
  
  }
  ngOnInit(): void {
    //Se crea observable que monitora la ruta (paramMap) para capturar el id
    this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = +params.get('id')! | 0;

      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });
  }

  
  //Seleccionar foto
  public seleccionarFoto(event:any) {
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
  }

  public subirFoto() {
    this.clienteService
      .subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe((cliente) => {
        this.cliente = cliente;
        Swal.fire(
          'La foto se ha subido completamente!',
          `La foto se ha subido con exito ${this.cliente.foto}`,
          'success'
        );
      });
  }
}
