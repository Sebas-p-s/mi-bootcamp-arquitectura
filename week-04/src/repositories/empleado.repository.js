let empleados = [];

class EmpleadoRepository {
  findAll() {
    return empleados;
  }

  findById(id) {
    return empleados.find(e => e.id === id);
  }

  create(data) {
    empleados.push(data);
    return data;
  }

  update(id, data) {
    const index = empleados.findIndex(e => e.id === id);
    if (index === -1) return null;

    empleados[index] = { ...empleados[index], ...data };
    return empleados[index];
  }

  delete(id) {
    empleados = empleados.filter(e => e.id !== id);
  }
}

module.exports = new EmpleadoRepository();