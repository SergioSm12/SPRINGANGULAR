import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public  modal: boolean= false;
  //Creamos atributo para monitorar la imagen subido
  public notificarUpload = new EventEmitter<any>();
  constructor() { }

  public abrirModal(){
    this.modal=true;
  }
  public cerrarModal(){
    this.modal=false;
  }
}
