import pg from 'pg';
import env from './env.js';

const { Pool } = pg;

/**
 * Konfigurasi koneksi PostgreSQL.
 * Mendukung DATABASE_URL (connection string) atau parameter PG* individual.
 */
function buildPoolConfig() {
  const ssl = env.pgSsl ? { rejectUnauthorized: false } : false;

  if (env.databaseUrl) {
    return { connectionString: env.databaseUrl, ssl };
  }

  return {
    host: env.pg.host,
    port: env.pg.port,
    user: env.pg.user,
    password: env.pg.password,
    database: env.pg.database,
    ssl,
  };
}

const pool = new Pool(buildPoolConfig());

pool.on('error', (err) => {
  // Jangan crash; cukup log. Koneksi idle yang error akan di-recycle pool.
  console.error('[db] Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Helper query terstandar.
 * @param {string} text - SQL dengan placeholder $1, $2, ...
 * @param {Array} [params]
 */
export function query(text, params) {
  return pool.query(text, params);
}

/**
 * Menjalankan sekumpulan operasi dalam satu transaksi.
 * @param {(client: import('pg').PoolClient) => Promise<any>} fn
 */
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/** Cek koneksi DB (dipakai health check). */
export async function pingDb() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0]?.ok === 1;
}

export default pool;
