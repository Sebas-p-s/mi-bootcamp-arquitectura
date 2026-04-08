
import { CrearEmpleadoUseCase } from '../../application/use-cases/crear-empleado.use-case.js';
import { ConsultarEmpleadoUseCase } from '../../application/use-cases/consultar-empleado.use-case.js';
import { InMemoryEmpleadoRepository } from '../../infrastructure/repositories/in-memory-empleado.repository.js';
import { InMemoryContratoRepository } from '../../infrastructure/repositories/in-memory-contrato.repository.js';
import { ConsoleNotificationAdapter } from '../../infrastructure/notifications/console-notification.adapter.js';

// Adaptadores compartidos (en producción usarías un contenedor DI)
const empleadoRepo = new InMemoryEmpleadoRepository();
const contratoRepo = new InMemoryContratoRepository();
const notification = new ConsoleNotificationAdapter();

const crearEmpleado   = new CrearEmpleadoUseCase({ empleadoRepository: empleadoRepo, notificationPort: notification });
const consultarEmpleado = new ConsultarEmpleadoUseCase({ empleadoRepository: empleadoRepo, contratoRepository: contratoRepo });

export const empleadoController = {
  
  async crear(req, res, next) {
    try {
      const empleado = await crearEmpleado.execute(req.body);
      res.status(201).json({ success: true, data: empleado.toJSON() });
    } catch (err) {
      next(err);
    }

  },

  async obtener(req, res, next) {

    try {
      const resultado = await consultarEmpleado.execute(req.params.id);
      res.json({ success: true, data: resultado });
    } catch (err) {
      next(err);
    }

  },

  async listar(req, res, next) {

    try {
      const todos = await empleadoRepo.findAll();
      res.json({ success: true, data: todos.map((e) => e.toJSON()), total: todos.length });
    } catch (err) {
      next(err);
    }
  },

};

