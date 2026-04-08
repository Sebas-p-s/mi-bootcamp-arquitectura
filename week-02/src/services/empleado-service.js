import { Empleado } from '../domain/entities/empleado.js';

export class EmpleadoService {
  constructor(repository, validator) {
    this.repository = repository;
    this.validator = validator;
  }

  async crearEmpleado(datos) {
    this.validator.validate(datos);

    const empleado = new Empleado(
      datos.id,
      datos.nombre,
      datos.cargo
    );

    return await this.repository.save(empleado);
  }

  async listarEmpleados() {
    return await this.repository.findAll();
  }
}
