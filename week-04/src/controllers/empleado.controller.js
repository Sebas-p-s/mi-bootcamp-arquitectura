const service = require('../services/empleado.service');

exports.getAll = (req, res, next) => {
  try {
    const data = service.getAll();
    res.json({
      success: true,
      data,
      timestamp: new Date()
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    const data = service.getById(req.params.id);
    if (!data) throw new Error('Empleado no encontrado');

    res.json({
      success: true,
      data,
      timestamp: new Date()
    });
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const nuevo = service.create({
      id: Date.now().toString(),
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: nuevo,
      timestamp: new Date()
    });
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const actualizado = service.update(req.params.id, req.body);
    if (!actualizado) throw new Error('Empleado no encontrado');

    res.json({
      success: true,
      data: actualizado,
      timestamp: new Date()
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};