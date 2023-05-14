import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginador: any;

  public paginas: number[] = [];
  public desde: number = 0;
  public hasta: number = 0;

  //Tan pronto se llama el componente se llama al metodo para la paginacion
  ngOnInit(): void {
    this.initPaginator();
  }

  //Aqui evaluamos si el paginador tiene un estado previo se actualice
  ngOnChanges(changes: SimpleChanges): void {
    let paginadorActualizado = changes['paginador'];

    if (paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  //Metodo para la logica de la paginacion
  private initPaginator(): void {
    //Metodos para determinar el rango cambiante de la paginacion "Evitar overflow"
    this.desde = Math.min(
      Math.max(1, this.paginador.number - 4),
      this.paginador.totalPages - 5
    );
    this.hasta = Math.max(
      Math.min(this.paginador.totalPages, this.paginador.number + 4),
      6
    );

    //Logica de la paginacion teniendo en cuenta el rango
    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1)
        .fill(0)
        .map((valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages)
        .fill(0)
        .map((valor, indice) => indice + 1);
    }
  }
}
