import rateLimit from 'express-rate-limit';

// Límite estricto para rutas de autenticación
// Previene ataques de fuerza bruta (OWASP A07)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // máx 10 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, intenta en 15 minutos' },
});

// Límite general para la API
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
