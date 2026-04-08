import { Repository } from '../domain/interfaces/repository.js';

export class MemoryEmpleadoRepository extends Repository {
  #data = new Map();

  async save(entity) {
    this.#data.set(entity.id, entity);
    return entity;
  }

  async findById(id) {
    return this.#data.get(id) || null;
  }

  async findAll() {
    return Array.from(this.#data.values());
  }
}
