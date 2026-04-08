# ADR-003: Selección de Patrón Arquitectónico para Sistema Rechum

## Estado

Aceptado

## Fecha

Abril 2026

---

## Contexto

### Descripción del Dominio

Sistema Rechum es una aplicación para la gestión de Recursos Humanos que permite administrar empleados, contratos, anotaciones y capacitaciones.

---

### Requisitos Identificados

#### Funcionales

- Registro de empleados
- Gestión de contratos
- Visualización de información
- Control por administradores

#### No Funcionales

| Requisito       | Nivel | Justificación |
|----------------|------|--------------|
| Escalabilidad  | Medio | Puede crecer con más usuarios |
| Performance    | Medio | No requiere tiempo real |
| Mantenibilidad | Alto  | El sistema evolucionará |
| Disponibilidad | Medio | Uso interno |
| Seguridad      | Alto  | Maneja datos sensibles |

---

### Restricciones

- Equipo: 1 desarrollador
- Tiempo: corto (bootcamp)
- Tecnología: Node.js

---

## Opciones Evaluadas

### Opción 1: Arquitectura en Capas

**Descripción**: Divide el sistema en capas como presentación, lógica y datos.

**Pros**:
- Fácil de entender
- Separación clara
- Ideal para proyectos pequeños

**Contras**:
- Puede crecer en complejidad

---

### Opción 2: MVC

**Descripción**: Divide en Modelo, Vista y Controlador.

**Pros**:
- Muy conocido
- Fácil implementación

**Contras**:
- Mezcla lógica en controladores
- Menos escalable

---

### Opción 3: Arquitectura Hexagonal

**Descripción**: Separa el dominio del exterior usando puertos y adaptadores.

**Pros**:
- Alta mantenibilidad
- Muy flexible

**Contras**:
- Compleja
- Difícil para proyectos pequeños

---

## Decisión

Se decidió usar **Arquitectura en Capas (N-Capas)** para el sistema Rechum.

---

## Justificación Principal

Se eligió porque permite organizar el sistema de forma clara, separando responsabilidades. Además, es adecuada para el tamaño del proyecto y el tiempo disponible.

---

## Resultado de la Matriz de Decisión

| Patrón              | Score |
|--------------------|------|
| Arquitectura Capas | 90   |
| MVC                | 75   |
| Hexagonal          | 70   |

**Ganador**: Arquitectura en Capas

---

## Consecuencias

### Positivas

- Código organizado
- Fácil mantenimiento
- Escalable

### Negativas

- Puede necesitar refactorización en el futuro

---

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|-------|-------------|--------|-----------|
| Desorden al crecer | Medio | Alto | Aplicar SOLID |

---

## Diagrama de Arquitectura

```mermaid
flowchart TD
    A[Usuario RRHH] --> B[Frontend]
    B --> C[Servicios]
    C --> D[Dominio]
    D --> E[Repositorio]
    E --> F[Base de Datos]
