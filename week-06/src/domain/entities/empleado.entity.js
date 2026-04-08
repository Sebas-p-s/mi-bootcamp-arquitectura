import { randomUUID } from 'crypto';


const TIPOS_VALIDOS = ['permanente', 'temporal', 'practicante'];

export class Empleado {
  #id;
  #nombre;
  #cargo;
  #tipo;
  #estado;
  #creadoEn;

  constructor({ id = randomUUID(), nombre, cargo, tipo = 'permanente' }) {

    if (!nombre || nombre.trim().length < 3) {
      throw new Error('El nombre del empleado debe tener al menos 3 caracteres');
    }
    if (!cargo || cargo.trim().length === 0) {
      throw new Error('El cargo del empleado es obligatorio');
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw new Error(`Tipo inválido: ${tipo}. Debe ser: ${TIPOS_VALIDOS.join(', ')}`);

    }

    this.#id = id;
    this.#nombre = nombre.trim();
    this.#cargo = cargo.trim();
    this.#tipo = tipo;
    this.#estado = 'ACTIVO';
    this.#creadoEn = new Date().toISOString();

  }

  desactivar() {

    if (this.#estado === 'INACTIVO') {
      throw new Error('El empleado ya está inactivo');
    }
    this.#estado = 'INACTIVO';

  }

  get id()        { return this.#id; }
  get nombre()    { return this.#nombre; }
  get cargo()     { return this.#cargo; }
  get tipo()      { return this.#tipo; }
  get estado()    { return this.#estado; }
  get creadoEn()  { return this.#creadoEn; }

  toJSON() {

    return {
      id: this.#id,
      nombre: this.#nombre,
      cargo: this.#cargo,
      tipo: this.#tipo,
      estado: this.#estado,
      creadoEn: this.#creadoEn,
    };
  }
  
}
