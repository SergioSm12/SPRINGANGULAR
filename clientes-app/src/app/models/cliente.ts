export class Cliente {
  public id: number;
  public nombre: string;
  public apellido: string;
  public createAt: string;
  public email: string;

  constructor(
    id: number,
    nombre: string,
    apellido: string,
    createAt: string,
    email: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.createAt = createAt;
    this.email = email;
  }
}
