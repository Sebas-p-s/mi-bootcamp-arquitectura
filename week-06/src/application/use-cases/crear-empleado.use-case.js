import { Empleado } from '../../domain/entities/empleado.entity.js';

// Caso de uso 1: Crear un nuevo empleado en el sistema Rechum
export class CrearEmpleadoUseCase {
  #empleadoRepository;
  #notificationPort;

  constructor({ empleadoRepository, notificationPort }) {
    this.#empleadoRepository = empleadoRepository;
    this.#notificationPort = notificationPort;
  }

  async execute({ nombre, cargo, tipo }) {
    // 1. Crear entidad (valida reglas de negocio del dominio)
    const empleado = new Empleado({ nombre, cargo, tipo });

    // 2. Persistir
    await this.#empleadoRepository.save(empleado);

    // 3. Notificar
    await this.#notificationPort.empleadoCreado({
      id: empleado.id,
      nombre: empleado.nombre,
      cargo: empleado.cargo,
    });

    return empleado;
  }
}
