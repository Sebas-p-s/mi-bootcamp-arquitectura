

// Puerto Primario: EmpleadoServicePort
// Define qué operaciones expone el dominio hacia el exterior (controllers, CLI, etc.)

/**
 * @interface EmpleadoServicePort
 *
 * @method crearEmpleado(data) → Promise<Empleado>
 * @method obtenerEmpleado(id) → Promise<Empleado>
 * @method listarEmpleados()   → Promise<Empleado[]>
 * @method desactivarEmpleado(id) → Promise<void>
 */

// Clase base que lanza NotImplemented si alguien olvida implementar un método
export class EmpleadoServicePort {

  crearEmpleado(_data)       { throw new Error('crearEmpleado no implementados'); }
  obtenerEmpleado(_id)       { throw new Error('obtenerEmpleado no implementados'); }
  listarEmpleados()          { throw new Error('listarEmpleados no implementados'); }
  desactivarEmpleado(_id)    { throw new Error('desactivarEmpleado no implementados'); }

}

