export class Cliente {
  public id: number;
  public nombre: string;
  public apellido: string;
  public createAt: string;
  public email: string;
  public foto: string;

  constructor(
    id: number,
    nombre: string,
    apellido: string,
    createAt: string,
    email: string,
    foto:string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.createAt = createAt;
    this.email = email;
    this.foto=foto;
  }
}
