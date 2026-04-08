const eventBus = require('./eventBus');

// Observer 1 — Auditoría
eventBus.on('empleadoCreado', (data) => {
  console.log(`📋 [AUDITORÍA] Nuevo empleado registrado: ${data.nombre} (id: ${data.id})`);
});

// Observer 2 — Notificación email simulada
eventBus.on('empleadoCreado', (data) => {
  console.log(`📧 [EMAIL] Bienvenida enviada a: ${data.nombre}`);
});

// Observer 3 — Actualización
eventBus.on('empleadoActualizado', (data) => {
  console.log(`✏️  [AUDITORÍA] Empleado actualizado: id ${data.id}`);
});

// Observer 4 — Eliminación
eventBus.on('empleadoEliminado', (data) => {
  console.log(`🗑️  [AUDITORÍA] Empleado eliminado: id ${data.id}`);
});
