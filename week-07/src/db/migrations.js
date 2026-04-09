import { getPool } from './pool.js';

const migrations = [
  {
    name: '001_create_empleados',
    sql: `
      CREATE TABLE IF NOT EXISTS empleados (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre     VARCHAR(200) NOT NULL,
        cargo      VARCHAR(200) NOT NULL,
        tipo       VARCHAR(50)  NOT NULL DEFAULT 'permanente',
        estado     VARCHAR(50)  NOT NULL DEFAULT 'ACTIVO',
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: '002_create_contratos',
    sql: `
      CREATE TABLE IF NOT EXISTS contratos (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        empleado_id   UUID        NOT NULL REFERENCES empleados(id),
        tipo_contrato VARCHAR(50) NOT NULL,
        salario       NUMERIC     NOT NULL,
        fecha_inicio  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        fecha_fin     TIMESTAMPTZ,
        estado        VARCHAR(50) NOT NULL DEFAULT 'BORRADOR',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: '003_create_anotaciones',
    sql: `
      CREATE TABLE IF NOT EXISTS anotaciones (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        empleado_id UUID         NOT NULL REFERENCES empleados(id),
        contenido   TEXT         NOT NULL,
        autor       VARCHAR(200) NOT NULL,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `,
  },
];

const runMigrations = async () => {
  const pool = getPool();
  if (!pool) {
    console.log('Sin base de datos configurada, saltando migraciones');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name       VARCHAR(100) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    for (const migration of migrations) {
      const { rows } = await client.query(
        'SELECT name FROM _migrations WHERE name = $1',
        [migration.name]
      );

      if (rows.length === 0) {
        await client.query(migration.sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [migration.name]);
        console.log(`Migración aplicada: ${migration.name}`);
      } else {
        console.log(`Migración ya aplicada: ${migration.name}`);
      }
    }

    console.log('Migraciones completadas');
  } finally {
    client.release();
  }
};

runMigrations()
  .then(() => { console.log('Script de migración finalizado'); process.exit(0); })
  .catch((err) => { console.error('Error en migraciones:', err); process.exit(1); });
