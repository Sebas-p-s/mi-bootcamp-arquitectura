const repo = require('../repositories/empleado.repository');

class EmpleadoService {
  getAll() {
    return repo.findAll();
  }

  getById(id) {
    return repo.findById(id);
  }

  create(data) {
    return repo.create(data);
  }

  update(id, data) {
    return repo.update(id, data);
  }

  delete(id) {
    return repo.delete(id);
  }
}

module.exports = new EmpleadoService();