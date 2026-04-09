import { createApp } from './app.js';
import { config } from './config.js';
import { closePool } from './db/pool.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(JSON.stringify({
    event: 'server_started',
    port: config.port,
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  }));
});

// Graceful shutdown — 12-Factor IX: Disposability
const shutdown = async (signal) => {
  console.log(`Señal ${signal} recibida. Cerrando servidor...`);
  server.close(async () => {
    await closePool();
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
  setTimeout(() => { console.error('Cierre forzado por timeout'); process.exit(1); }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
