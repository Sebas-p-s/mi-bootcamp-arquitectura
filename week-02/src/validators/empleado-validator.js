export class EmpleadoValidator {
  validate(datos) {
    if (!datos.nombre) {
      throw new Error('El nombre es obligatorio');
    }

    if (!datos.cargo) {
      throw new Error('El cargo es obligatorio');
    }
  }
}
