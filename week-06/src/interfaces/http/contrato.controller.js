import { FirmarContratoUseCase } from '../../application/use-cases/firmar-contrato.use-case.js';
import { InMemoryEmpleadoRepository } from '../../infrastructure/repositories/in-memory-empleado.repository.js';
import { InMemoryContratoRepository } from '../../infrastructure/repositories/in-memory-contrato.repository.js';
import { ConsoleNotificationAdapter } from '../../infrastructure/notifications/console-notification.adapter.js';

const empleadoRepo = new InMemoryEmpleadoRepository();
const contratoRepo = new InMemoryContratoRepository();
const notification = new ConsoleNotificationAdapter();

const firmarContrato = new FirmarContratoUseCase({
  empleadoRepository: empleadoRepo,
  contratoRepository: contratoRepo,
  notificationPort: notification,
});

export const contratoController = {
  async firmar(req, res, next) {
    try {
      const contrato = await firmarContrato.execute(req.body);
      res.status(201).json({ success: true, data: contrato.toJSON() });
    } catch (err) {
      next(err);
    }
  },
};
