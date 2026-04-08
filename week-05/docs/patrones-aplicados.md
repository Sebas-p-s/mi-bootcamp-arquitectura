Patrones de Diseño Aplicados — API Rechum (Semana 05)

Patrón 1: Factory Method (Creacional)
Problema Original
En el controller original, la creación del objeto empleado estaba dispersa: el id se generaba con Date.now() directamente en el controller, no había distinción entre tipos de empleado, y los campos por defecto (activo, creadoEn, beneficios) no existían.
Antes (❌)
jsconst nuevo = service.create({
  id: Date.now().toString(),
  ...req.body,
  salario
});
Después (✅)
jsconst empleado = EmpleadoFactory.crear(body.tipoEmpleado || 'general', {
  ...body,
  salario,
});
Principio SOLID Reforzado
SRP (Single Responsibility): El controller ya no es responsable de construir el objeto. Esa responsabilidad recae exclusivamente en la Factory.
OCP (Open/Closed): Para agregar un nuevo tipo de empleado (ej. freelance), solo se agrega un case en la factory sin tocar el controller ni el service.
Diagrama
Ver docs/diagramas/factory-empleado.md
Beneficios Obtenidos

Creación centralizada y predecible de empleados
Fácil agregar nuevos tipos sin modificar código existente
Los objetos siempre tienen campos completos y consistentes


Patrón 2: Decorator (Estructural)
Problema Original
El EmpleadoService no tenía logging. Agregarlo directamente viola el SRP: el service debe encargarse de negocio, no de logging.
Antes (❌)
js// No había logging. Para agregarlo había que modificar el service directamente.
create(data) {
  return repo.create(data);
}
Después (✅)
js// Decorator envuelve el service sin modificarlo
create(data) {
  console.log(`[LOG] create() llamado con nombre: ${data.nombre}`);
  const result = this._service.create(data);
  console.log(`[LOG] Empleado creado con id: ${result.id}`);
  return result;
}
Principio SOLID Reforzado
SRP: El service original no sabe nada de logging. El decorator es el único responsable de esa funcionalidad.
OCP: Se puede agregar un CacheDecorator o MetricsDecorator apilándolo sobre el anterior sin modificar ninguna clase existente.
Diagrama
Ver docs/diagramas/decorator-empleado.md
Beneficios Obtenidos

Logging sin contaminar la lógica de negocio
Se puede quitar o cambiar el logging sin tocar el service
Patrón apilable: se pueden encadenar múltiples decoradores


Patrón 3: Facade (Estructural)
Problema Original
El controller coordinaba manualmente: el strategy para calcular salario, la creación del empleado, el service para persistir, y el eventBus para notificar. Cuatro dependencias directas en el controller.
Antes (❌)
js// El controller hacía TODO esto:
const estrategia = new ContratoTiempoCompleto();
const contexto = new ContratoContext(estrategia);
const salario = contexto.calcular(req.body.salarioBase || 1000);
const nuevo = service.create({ id: Date.now().toString(), ...req.body, salario });
eventBus.emit('empleadoCreado', nuevo);
Después (✅)
js// El controller solo llama a la Facade
const nuevo = facade.crearEmpleado(req.body);
Principio SOLID Reforzado
SRP: El controller solo maneja HTTP. La Facade orquesta los subsistemas.
DIP (Dependency Inversion): El controller depende de la abstracción (Facade), no de las implementaciones concretas (Factory, Strategy, EventBus).
Diagrama
Ver docs/diagramas/facade-empleado.md
Beneficios Obtenidos

Controller limpio y fácil de leer
Subsistemas intercambiables sin afectar el controller
Un solo punto de entrada para las operaciones de empleados


Patrón 4: Observer (Comportamiento)
Problema Original
Al crear un empleado se necesitaba notificar a múltiples sistemas (auditoría, email). Hacerlo directamente en el controller o service acoplaría esos sistemas entre sí.
Antes (❌)
js// No había sistema de eventos. Las notificaciones estarían hardcodeadas:
console.log('Email enviado a:', nuevo.nombre);
console.log('Auditoría:', nuevo);
Después (✅)
js// El emisor no conoce a los suscriptores
eventBus.emit('empleadoCreado', nuevo);

// Los observadores se registran de forma independiente
eventBus.on('empleadoCreado', (data) => { /* auditoría */ });
eventBus.on('empleadoCreado', (data) => { /* email */ });
Principio SOLID Reforzado
OCP: Agregar un nuevo observador (ej. Slack, SMS) no requiere modificar el emisor.
SRP: Cada observador tiene una única responsabilidad (auditar, enviar email, etc.).
Diagrama
Ver docs/diagramas/observer-empleado.md
Beneficios Obtenidos

Desacoplamiento total entre el emisor y los receptores
Fácil agregar nuevos comportamientos reactivos
Los observadores pueden activarse/desactivarse de forma independiente


Patrón 5: Strategy (Comportamiento)
Problema Original
El cálculo de salario estaba hardcodeado con if/else en el controller. Agregar un nuevo tipo de contrato requería modificar el controller directamente.
Antes (❌)
jsif (req.body.tipoContrato === 'completo') {
  estrategia = new ContratoTiempoCompleto();
} else {
  estrategia = new ContratoMedioTiempo();
}
Después (✅)
js// La Facade selecciona la estrategia; el contexto la ejecuta
const estrategia = body.tipoContrato === 'completo'
  ? new ContratoTiempoCompleto()
  : new ContratoMedioTiempo();
const contexto = new ContratoContext(estrategia);
const salario = contexto.calcular(body.salarioBase || 1000);
Principio SOLID Reforzado
OCP: Agregar ContratoPracticante solo requiere crear la clase y agregar la opción de selección. No se modifica ninguna clase existente.
SRP: Cada clase de estrategia tiene una sola responsabilidad: calcular su tipo de salario.
Diagrama
Ver docs/diagramas/strategy-contrato.md
Beneficios Obtenidos

Algoritmos de cálculo intercambiables en tiempo de ejecución
Fácil agregar nuevos tipos de contrato
Cada cálculo es testeable de forma aislada


Cómo Cooperan los Patrones
HTTP Request
    │
    ▼
Controller          ← solo HTTP
    │
    ▼
Facade              ← orquesta todo
    ├── Strategy    ← calcula salario según tipo de contrato
    ├── Factory     ← construye el objeto empleado completo
    ├── Service     ← lógica de negocio
    │   └── Decorator ← logging transparente
    │       └── Repository ← persistencia
    └── Observer    ← notifica a auditoría, email, etc.
Cada patrón resuelve un problema distinto y todos cooperan sin acoplarse entre sí.