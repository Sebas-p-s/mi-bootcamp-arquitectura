// PATRÓN: Decorator
// PROBLEMA: Necesitábamos logging de operaciones pero no queríamos mezclar
//           esa responsabilidad dentro del EmpleadoService (viola SRP).
// SOLUCIÓN: Envolver el service con un decorator que agrega logging
//           sin modificar el código original.

class EmpleadoServiceDecorator {
  constructor(service) {
    this._service = service;
  }

  getAll() {
    console.log('[LOG] getAll() llamado');
    const result = this._service.getAll();
    console.log(`[LOG] getAll() retornó ${result.length} empleados`);
    return result;
  }

  getById(id) {
    console.log(`[LOG] getById(${id}) llamado`);
    const result = this._service.getById(id);
    if (!result) console.warn(`[WARN] Empleado ${id} no encontrado`);
    return result;
  }

  create(data) {
    console.log(`[LOG] create() llamado con nombre: ${data.nombre}`);
    const result = this._service.create(data);
    console.log(`[LOG] Empleado creado con id: ${result.id}`);
    return result;
  }

  update(id, data) {
    console.log(`[LOG] update(${id}) llamado`);
    const result = this._service.update(id, data);
    if (!result) console.warn(`[WARN] update: Empleado ${id} no encontrado`);
    return result;
  }

  delete(id) {
    console.log(`[LOG] delete(${id}) llamado`);
    return this._service.delete(id);
  }
}

module.exports = EmpleadoServiceDecorator;
