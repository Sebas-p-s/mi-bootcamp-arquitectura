// 12-Factor III: Config — toda la configuración viene de variables de entorno

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Variable de entorno requerida no definida: ${name}`);
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl:
    process.env.NODE_ENV === 'production'
      ? required('DATABASE_URL')
      : process.env.DATABASE_URL,
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction   = config.nodeEnv === 'production';
