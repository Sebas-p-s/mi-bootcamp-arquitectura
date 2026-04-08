import { MemoryEmpleadoRepository } from './repositories/memory-empleado-repository.js';
import { EmpleadoValidator } from './validators/empleado-validator.js';
import { EmpleadoService } from './services/empleado-service.js';

const repository = new MemoryEmpleadoRepository();
const validator = new EmpleadoValidator();

const service = new EmpleadoService(repository, validator);

async function main() {
  await service.crearEmpleado({
    id: 1,
    nombre: 'Juan',
    cargo: 'Desarrollador'
  });

  const empleados = await service.listarEmpleados();
  console.log(empleados);
}

main();
