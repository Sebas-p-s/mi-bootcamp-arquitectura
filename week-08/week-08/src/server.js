import { createApp } from './interfaces/http/app.js';
import { config } from './config.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(JSON.stringify({
    event: 'server_started',
    port: config.port,
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  }));
});

const shutdown = async (signal) => {
  console.log(`Señal ${signal} recibida. Cerrando servidor...`);
  server.close(() => { console.log('Servidor cerrado'); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
