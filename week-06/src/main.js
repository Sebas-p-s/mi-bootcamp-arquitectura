
import express from 'express';
import { empleadoController } from './interfaces/http/empleado.controller.js';
import { contratoController } from './interfaces/http/contrato.controller.js';

const app = express();
app.use(express.json());

// Rutas
app.get('/api/v1/empleados',       empleadoController.listar);
app.get('/api/v1/empleados/:id',   empleadoController.obtener);
app.post('/api/v1/empleados',      empleadoController.crear);
app.post('/api/v1/contratos/firmar', contratoController.firmar);

app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 400).json({ success: false, message: err.message });
});

app.listen(3000, () => {
  console.log('🚀 Rechum API corriendo en http://localhost:3000');
});
