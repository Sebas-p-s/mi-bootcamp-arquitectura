export class Repository {
  async save(entity) {
    throw new Error('Implementar save()');
  }

  async findById(id) {
    throw new Error('Implementar findById()');
  }

  async findAll() {
    throw new Error('Implementar findAll()');
  }
}
