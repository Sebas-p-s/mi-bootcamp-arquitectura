# SOLID APLICADO - Sistema Rechum

## Descripción del Dominio
Sistema de gestión de Recursos Humanos que permite administrar empleados y contratos de forma organizada.

---

## 🔵 SRP (Single Responsibility Principle)

Se separaron responsabilidades en diferentes clases:

| Responsabilidad | Clase                | Razón de Cambio                  |
|----------------|---------------------|----------------------------------|
| Datos          | Empleado            | Cambios en atributos             |
| Validación     | EmpleadoValidator   | Nuevas reglas de negocio         |
| Persistencia   | MemoryRepository    | Cambio de base de datos          |

Cada clase tiene una única responsabilidad.

---

## 🟢 OCP (Open/Closed Principle)

Se implementó una jerarquía de contratos:

- Clase base: `Contrato`
- Extensiones:
  - `ContratoIndefinido`
  - `ContratoTemporal`

Esto permite agregar nuevos tipos sin modificar la clase base.

---

## 🟡 LSP (Liskov Substitution Principle)

Los subtipos pueden reemplazar a la clase base sin errores:

```javascript
function procesarContrato(contrato) {
  contrato.calcularSalario();
}
