import { z } from 'zod';

const configSchema = z.object({
  PORT:            z.coerce.number().default(3000),
  NODE_ENV:        z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL:    z.string().url().optional(),
  JWT_SECRET:      z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN:  z.string().default('15m'),
  BCRYPT_ROUNDS:   z.coerce.number().min(10).default(12),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  APP_NAME:        z.string().default('rechum-api'),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  port:           parsed.data.PORT,
  nodeEnv:        parsed.data.NODE_ENV,
  databaseUrl:    parsed.data.DATABASE_URL,
  jwtSecret:      parsed.data.JWT_SECRET,
  jwtExpiresIn:   parsed.data.JWT_EXPIRES_IN,
  bcryptRounds:   parsed.data.BCRYPT_ROUNDS,
  allowedOrigins: parsed.data.ALLOWED_ORIGINS,
  appName:        parsed.data.APP_NAME,
};
