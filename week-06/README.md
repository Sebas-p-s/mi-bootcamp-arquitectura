# Rechum — Semana 06: Arquitectura Hexagonal

Refactorización de la API de RRHH hacia **Ports & Adapters (Arquitectura Hexagonal)**.

## Objetivo Cumplido

> Cualquier módulo del dominio es testeable en menos de 2 segundos **sin levantar servidor, sin BD y sin red.**

```bash
node --test tests/**/*.test.js
# ✓ 15+ pruebas pasando en < 2s
```

---

## Arquitectura

```
HTTP / CLI / Tests
        │
        ▼
  [ Interfaces ]         → controllers (solo HTTP, sin lógica)
        │
        ▼
  [ Application ]        → use-cases (orquesta el dominio)
        │
        ▼
  [ Domain ]             → entities, value-objects, aggregates, ports, domain-services
        │
        ▼
  [ Infrastructure ]     → repositorios InMemory / PostgreSQL, adaptadores de notificación
```

### Capas y responsabilidades

| Capa | Qué contiene | Qué NO puede importar |
|------|-------------|----------------------|
| `domain/` | Entidades, VOs, Aggregates, Puertos, DomainService | Nada de Express, BD, ni frameworks |
| `application/` | Casos de uso | Express, infraestructura concreta |
| `infrastructure/` | Repositorios, adaptadores | Dominio (solo implementa puertos) |
| `interfaces/` | Controllers HTTP | Lógica de negocio |

---

## Entidades del Dominio

### Empleado (entidad principal)
- Campos obligatorios: `nombre` (mín. 3 chars), `cargo`
- Tipos válidos: `permanente`, `temporal`, `practicante`
- Estado inicial: `ACTIVO`

### SalarioVO (Value Object)
- Rango válido: $1.300.000 — $50.000.000 (COP)
- Inmutable (`Object.freeze`)
- Detecta si es salario alto (≥ $5.000.000)

### Contrato (Aggregate)
- Estados: `BORRADOR` → `FIRMADO` → `TERMINADO`
- Regla: contratos temporales y practicantes requieren `fechaFin`
- Emite eventos de dominio: `ContratoFirmado`, `ContratoTerminado`

---

## Reglas de Negocio (viven en el dominio)

1. Un empleado debe tener nombre de al menos 3 caracteres
2. El salario debe estar entre el mínimo legal y el máximo del sistema
3. Un empleado `INACTIVO` no puede firmar contratos
4. Un empleado solo puede tener **1 contrato FIRMADO** al mismo tiempo
5. Los contratos temporales y de practicante **requieren fecha de fin**
6. El salario final se calcula según el tipo de contrato:
   - Tiempo completo: base × 1.3
   - Medio tiempo: base × 0.5
   - Practicante: base × 0.25

---

## Casos de Uso

| Caso de Uso | Archivo |
|-------------|---------|
| Crear empleado | `crear-empleado.use-case.js` |
| Firmar contrato | `firmar-contrato.use-case.js` |
| Consultar empleado con contratos | `consultar-empleado.use-case.js` |

---

## Instalación y Uso

```bash
npm install
npm start       # levanta el servidor en http://localhost:3000
npm test        # corre todos los tests sin BD ni servidor
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/empleados | Listar todos |
| GET | /api/v1/empleados/:id | Consultar con contratos |
| POST | /api/v1/empleados | Crear empleado |
| POST | /api/v1/contratos/firmar | Firmar contrato |

### Ejemplo: Crear empleado
```json
POST /api/v1/empleados
{
  "nombre": "Ana Torres",
  "cargo": "Analista RRHH",
  "tipo": "permanente"
}
```

### Ejemplo: Firmar contrato
```json
POST /api/v1/contratos/firmar
{
  "empleadoId": "uuid-del-empleado",
  "tipoContrato": "completo",
  "salarioBase": 2000000
}
```

---

## Extensibilidad (Open/Closed Principle)

Para cambiar la persistencia a PostgreSQL **sin tocar ningún caso de uso**:
```js
// Solo crear un nuevo adaptador que implemente el puerto
class PostgresEmpleadoRepository extends EmpleadoRepositoryPort {
  async findById(id) { /* consulta SQL */ }
  async save(empleado) { /* INSERT/UPDATE */ }
  // ...
}
// Inyectar en el use-case — nada más cambia
```

Para agregar notificaciones por email:
```js
class EmailNotificationAdapter extends NotificationPort {
  async contratoFirmado(data) { /* enviar email */ }
}
```

---

## Estructura del Proyecto

```
src/
├── main.js
├── domain/
│   ├── entities/
│   │   └── empleado.entity.js
│   ├── value-objects/
│   │   └── salario.vo.js
│   ├── aggregates/
│   │   └── contrato.aggregate.js
│   ├── ports/
│   │   ├── primary/
│   │   │   └── empleado-service.port.js
│   │   └── secondary/
│   │       ├── empleado.repository.port.js
│   │       ├── contrato.repository.port.js
│   │       └── notification.port.js
│   └── services/
│       └── contrato.domain-service.js
├── application/
│   └── use-cases/
│       ├── crear-empleado.use-case.js
│       ├── firmar-contrato.use-case.js
│       └── consultar-empleado.use-case.js
├── infrastructure/
│   ├── repositories/
│   │   ├── in-memory-empleado.repository.js
│   │   └── in-memory-contrato.repository.js
│   └── notifications/
│       └── console-notification.adapter.js
└── interfaces/
    └── http/
        ├── empleado.controller.js
        └── contrato.controller.js
tests/
├── domain/
│   └── empleado.test.js         (10 pruebas de entidad, VO y aggregate)
└── application/
    └── firmar-contrato.test.js  (7 pruebas de casos de uso)
```

---

## Relación con Semanas Anteriores

| Semana | Aporte |
|--------|--------|
| 04 | API RESTful base con Express |
| 05 | Patrones Strategy y Observer (ahora viven en domain-service) |
| 06 | Arquitectura Hexagonal completa con tests |
