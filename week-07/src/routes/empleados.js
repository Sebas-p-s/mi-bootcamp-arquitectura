import { Router } from 'express';
import { EmpleadoService } from '../services/empleado-service.js';

export const empleadoRouter = Router();
const service = new EmpleadoService();

empleadoRouter.get('/', async (_req, res, next) => {
  try {
    const empleados = await service.getAll();
    res.json({ success: true, data: empleados, total: empleados.length });
  } catch (err) { next(err); }
});

empleadoRouter.get('/:id', async (req, res, next) => {
  try {
    const emp = await service.getById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    res.json({ success: true, data: emp });
  } catch (err) { next(err); }
});

empleadoRouter.post('/', async (req, res, next) => {
  try {
    const emp = await service.create(req.body);
    res.status(201).json({ success: true, data: emp });
  } catch (err) { next(err); }
});

empleadoRouter.put('/:id', async (req, res, next) => {
  try {
    const emp = await service.update(req.params.id, req.body);
    if (!emp) return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    res.json({ success: true, data: emp });
  } catch (err) { next(err); }
});

empleadoRouter.delete('/:id', async (req, res, next) => {
  try {
    await service.delete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});
