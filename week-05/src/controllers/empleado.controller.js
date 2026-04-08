// Controller — delega toda la lógica a la Facade
// El controller solo maneja HTTP: parsea request y forma response.

const facade = require('../patterns/facade/empleado.facade');

exports.getAll = (req, res, next) => {
  try {
    const empleados = facade.obtenerTodos();
    res.json({ success: true, data: empleados, total: empleados.length });
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    const empleado = facade.obtenerPorId(req.params.id);
    if (!empleado) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    res.json({ success: true, data: empleado });
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const nuevo = facade.crearEmpleado(req.body);
    res.status(201).json({ success: true, data: nuevo, timestamp: new Date() });
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const actualizado = facade.actualizarEmpleado(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    res.json({ success: true, data: actualizado });
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    facade.eliminarEmpleado(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
