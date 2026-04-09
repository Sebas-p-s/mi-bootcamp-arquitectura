import { getPool } from '../db/pool.js';

export class EmpleadoService {
  async getAll() {
    const pool = getPool();
    if (!pool) return [];
    const { rows } = await pool.query(
      'SELECT * FROM empleados ORDER BY created_at DESC'
    );
    return rows;
  }

  async getById(id) {
    const pool = getPool();
    if (!pool) return null;
    const { rows } = await pool.query(
      'SELECT * FROM empleados WHERE id = $1', [id]
    );
    return rows[0] ?? null;
  }

  async create({ nombre, cargo, tipo = 'permanente' }) {
    if (!nombre || nombre.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    if (!cargo) throw new Error('El cargo es obligatorio');

    const pool = getPool();
    if (!pool) throw new Error('Base de datos no disponible');

    const { rows } = await pool.query(
      `INSERT INTO empleados (nombre, cargo, tipo)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre.trim(), cargo.trim(), tipo]
    );
    return rows[0];
  }

  async update(id, data) {
    const pool = getPool();
    if (!pool) throw new Error('Base de datos no disponible');
    const { rows } = await pool.query(
      `UPDATE empleados SET
         nombre = COALESCE($1, nombre),
         cargo  = COALESCE($2, cargo),
         tipo   = COALESCE($3, tipo),
         updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [data.nombre, data.cargo, data.tipo, id]
    );
    return rows[0] ?? null;
  }

  async delete(id) {
    const pool = getPool();
    if (!pool) throw new Error('Base de datos no disponible');
    await pool.query('DELETE FROM empleados WHERE id = $1', [id]);
  }
}
