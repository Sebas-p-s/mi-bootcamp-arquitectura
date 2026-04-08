import { NotificationPort } from '../../domain/ports/secondary/notification.port.js';

// Adaptador concreto: notifica por consola
// En producción se reemplazaría por EmailNotification, SlackNotification, etc
// sin modificar ningún caso de uso (Open/Closed Principle)
export class ConsoleNotificationAdapter extends NotificationPort {
  async contratoFirmado({ empleado, tipoContrato, salario }) {
    console.log(
      `📋 [Rechum] Contrato firmado — Empleado: ${empleado} | Tipo: ${tipoContrato} | Salario: $${salario.toLocaleString('es-CO')}`
    );
  }

  async empleadoCreado({ nombre, cargo }) {
    console.log(`👤 [Rechum] Nuevo empleado registrado — ${nombre} (${cargo})`);
  }
}
