// Puerto Secundario: NotificationPort
// Abstracción para cualquier mecanismo de notificación (consola, email, Slack...)


export class NotificationPort {
  contratoFirmado(_data)    { throw new Error('contratoFirmado no implementado'); }
  empleadoCreado(_data)     { throw new Error('empleadoCreado no implementado'); }
}
