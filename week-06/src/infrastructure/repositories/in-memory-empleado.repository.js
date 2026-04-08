import { EmpleadoRepositoryPort } from '../../domain/ports/secondary/empleado.repository.port.js';

// Adaptador InMemory — para tests y desarrollo local, no requiere base de datos ni red
export class InMemoryEmpleadoRepository extends EmpleadoRepositoryPort {
  #data = new Map();

  async findById(id) {
    return this.#data.get(id) ?? null;
  }

  async findAll() {
    return [...this.#data.values()];
  }

  async save(empleado) {
    this.#data.set(empleado.id, empleado);
  }

  async delete(id) {
    this.#data.delete(id);
  }

  // Utilidad para limpiar entre tests
  clear() {
    this.#data.clear();
  }

  get size() {
    return this.#data.size;
  }
}
