import { ContratoRepositoryPort } from '../../domain/ports/secondary/contrato.repository.port.js';

export class InMemoryContratoRepository extends ContratoRepositoryPort {
  #data = new Map();

  async findById(id) {
    return this.#data.get(id) ?? null;
  }

  async findByEmpleadoId(empleadoId) {
    return [...this.#data.values()].filter((c) => c.empleadoId === empleadoId);
  }

  async save(contrato) {
    this.#data.set(contrato.id, contrato);
  }

  clear() {
    this.#data.clear();
  }

  get size() {
    return this.#data.size;
  }
}
