import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

let pool = null;

export const getPool = () => {
  if (!config.databaseUrl) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });

    pool.on('error', (err) => {
      console.error('Error inesperado en cliente PostgreSQL:', err);
    });
  }
  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
