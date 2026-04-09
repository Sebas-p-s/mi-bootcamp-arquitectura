import express from 'express';
import { empleadoRouter } from './routes/empleados.js';

export const createApp = () => {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  // Health check — responde sin necesitar BD
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Readiness — verifica que la BD esté disponible
  app.get('/ready', async (_req, res) => {
    try {
      const { getPool } = await import('./db/pool.js');
      const pool = getPool();
      if (pool) {
        await pool.query('SELECT 1');
        res.json({ status: 'ready' });
      } else {
        res.status(503).json({ status: 'sin base de datos configurada' });
      }
    } catch {
      res.status(503).json({ status: 'base de datos no disponible' });
    }
  });

  app.use('/api/empleados', empleadoRouter);

  // Manejo global de errores
  app.use((err, _req, res, _next) => {
    console.error(JSON.stringify({ event: 'error', message: err.message }));
    res.status(err.status || 400).json({ success: false, message: err.message });
  });

  return app;
};
