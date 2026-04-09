import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';
import { config } from '../../config.js';
import { authLimiter, apiLimiter } from '../../infrastructure/security/rate-limiter.js';
import { authenticate } from './middlewares/authenticate.js';
import { authorize } from './middlewares/authorize.js';
import { validate } from './middlewares/validate.js';
import { authController } from './auth.controller.js';

// Schemas de validación Zod para Rechum
const registerSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role:     z.enum(['EMPLEADO', 'RRHH', 'ADMIN']).default('EMPLEADO'),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

const empleadoSchema = z.object({
  nombre: z.string().min(3),
  cargo:  z.string().min(1),
  tipo:   z.enum(['permanente', 'temporal', 'practicante']).default('permanente'),
});

const allowedOrigins = (config.allowedOrigins ?? 'http://localhost:5173').split(',');

export const createApp = () => {
  const app = express();

  // Headers de seguridad — OWASP A05
  app.use(helmet());

  // CORS restrictivo
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origen no permitido: ${origin}`));
      }
    },
    credentials: true,
  }));

  // Limitar tamaño del body — OWASP A03
  app.use(express.json({ limit: '100kb' }));

  // Health check sin autenticación ni rate limit
  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Rate limit para auth
  app.use('/auth', authLimiter);

  // Rutas de autenticación
  app.post('/auth/register', validate(registerSchema), authController.register);
  app.post('/auth/login',    validate(loginSchema),    authController.login);

  // Rate limit general para API
  app.use('/api', apiLimiter);

  // Rutas protegidas de empleados
  // EMPLEADO: solo lectura | RRHH: crear y actualizar | ADMIN: todo
  app.get('/api/empleados',
    authenticate,
    authorize('EMPLEADO', 'RRHH', 'ADMIN'),
    (_req, res) => res.json({ success: true, data: [], message: 'Lista de empleados' })
  );

  app.post('/api/empleados',
    authenticate,
    authorize('RRHH', 'ADMIN'),
    validate(empleadoSchema),
    (_req, res) => res.status(201).json({ success: true, message: 'Empleado creado' })
  );

  app.delete('/api/empleados/:id',
    authenticate,
    authorize('ADMIN'),
    (_req, res) => res.status(204).send()
  );

  // Manejo global de errores
  app.use((err, _req, res, _next) => {
    console.error(JSON.stringify({ event: 'error', message: err.message }));
    res.status(err.status || 400).json({ success: false, message: err.message });
  });

  return app;
};
