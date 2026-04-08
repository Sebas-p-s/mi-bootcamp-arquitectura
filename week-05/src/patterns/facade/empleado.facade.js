// PATRÓN: Facade
// PROBLEMA: El controller tenía que coordinar manualmente el factory,
//           el strategy, el service y el eventBus — demasiadas dependencias.
// SOLUCIÓN: Una Facade que expone operaciones simples y orquesta
//           todos los subsistemas internamente.

const EmpleadoFactory = require('../factory/empleado.factory');
const EmpleadoServiceDecorator = require('../decorator/empleado.decorator');
const rawService = require('../../services/empleado.service');
const eventBus = require('../observer/eventBus');

const {
  ContratoTiempoCompleto,
  ContratoMedioTiempo,
} = require('../strategy/contrato.strategy');
const ContratoContext = require('../strategy/contrato.context');

const service = new EmpleadoServiceDecorator(rawService);

class EmpleadoFacade {
  crearEmpleado(body) {
    // 1. Strategy: calcular salario según tipo de contrato
    const estrategia =
      body.tipoContrato === 'completo'
        ? new ContratoTiempoCompleto()
        : new ContratoMedioTiempo();
    const contexto = new ContratoContext(estrategia);
    const salario = contexto.calcular(body.salarioBase || 1000);

    // 2. Factory: construir el objeto empleado según su tipo
    const empleado = EmpleadoFactory.crear(body.tipoEmpleado || 'general', {
      ...body,
      salario,
    });

    // 3. Service (decorado): persistir
    const nuevo = service.create(empleado);

    // 4. Observer: notificar a los suscriptores
    eventBus.emit('empleadoCreado', nuevo);

    return nuevo;
  }

  obtenerTodos() {
    return service.getAll();
  }

  obtenerPorId(id) {
    return service.getById(id);
  }

  actualizarEmpleado(id, body) {
    const actualizado = service.update(id, body);
    if (actualizado) eventBus.emit('empleadoActualizado', actualizado);
    return actualizado;
  }

  eliminarEmpleado(id) {
    service.delete(id);
    eventBus.emit('empleadoEliminado', { id });
  }
}

module.exports = new EmpleadoFacade();
