# API Rechum — Semana 05: Patrones de Diseño

API RESTful de gestión de empleados refactorizada con 5 patrones de diseño.

## Patrones Implementados

| # | Patrón | Categoría | Problema que Resuelve |
|---|--------|-----------|----------------------|
| 1 | Factory Method | Creacional | Creación dispersa de objetos empleado |
| 2 | Decorator | Estructural | Logging sin contaminar el service |
| 3 | Facade | Estructural | Controller con demasiadas dependencias |
| 4 | Observer | Comportamiento | Notificaciones acopladas al emisor |
| 5 | Strategy | Comportamiento | Cálculo de salario hardcodeado con if/else |

## Cómo Cooperan los Patrones

```
HTTP Request
    │
    ▼
Controller          ← solo maneja HTTP
    │
    ▼
Facade              ← orquesta todos los subsistemas
    ├── Strategy    ← calcula salario según tipo de contrato
    ├── Factory     ← construye el objeto empleado completo
    ├── Service     ← lógica de negocio
    │   └── Decorator ← logging transparente sobre el service
    │       └── Repository ← persistencia en memoria
    └── Observer    ← notifica auditoría, email, etc.
```

## Instalación y Uso

```bash
npm install
node src/index.js
```

- API: http://localhost:3000/api/v1/empleados
- Swagger UI: http://localhost:3000/api-docs

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/empleados | Listar todos |
| GET | /api/v1/empleados/:id | Obtener por ID |
| POST | /api/v1/empleados | Crear empleado |
| PUT | /api/v1/empleados/:id | Actualizar empleado |
| DELETE | /api/v1/empleados/:id | Eliminar empleado |

## Ejemplo de Creación

```json
POST /api/v1/empleados
{
  "nombre": "Ana Gómez",
  "cargo": "Desarrolladora",
  "tipoEmpleado": "permanente",
  "tipoContrato": "completo",
  "salarioBase": 2000
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "id": "1712345678901",
    "nombre": "Ana Gómez",
    "cargo": "Desarrolladora",
    "tipo": "permanente",
    "beneficios": ["salud", "pension", "vacaciones"],
    "salario": 2600,
    "activo": true,
    "creadoEn": "2026-04-08T..."
  }
}
```

## Extensibilidad

Para agregar un nuevo tipo de contrato (sin modificar código existente):

```js
// 1. Crear nueva estrategia en contrato.strategy.js
class ContratoFreelance {
  calcular(salarioBase) {
    return salarioBase * 0.8; // 80% por proyecto
  }
}

// 2. Agregar case en la Facade
case 'freelance': return new ContratoFreelance();
```

Para agregar un nuevo observador (sin modificar nada):

```js
// Solo registrar en empleado.observer.js
eventBus.on('empleadoCreado', (data) => {
  // enviar a Slack, SMS, etc.
});
```

## Estructura del Proyecto

```
src/
├── index.js
├── swagger.js
├── controllers/
│   └── empleado.controller.js
├── services/
│   └── empleado.service.js
├── repositories/
│   └── empleado.repository.js
├── routes/
│   └── empleado.routes.js
├── middleware/
│   └── error-handler.js
└── patterns/
    ├── factory/
    │   └── empleado.factory.js
    ├── decorator/
    │   └── empleado.decorator.js
    ├── facade/
    │   └── empleado.facade.js
    ├── observer/
    │   ├── eventBus.js
    │   └── empleado.observer.js
    └── strategy/
        ├── contrato.strategy.js
        └── contrato.context.js
docs/
├── patrones-aplicados.md
└── diagramas/
    ├── factory-empleado.md
    ├── decorator-empleado.md
    ├── facade-empleado.md
    ├── observer-empleado.md
    └── strategy-contrato.md
```
