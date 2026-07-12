import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pool from '../config/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Menjalankan schema.sql untuk membuat/menyelaraskan tabel.
 * Idempotent: aman dijalankan berulang.
 */
async function migrate() {
  const schemaPath = join(__dirname, 'schema.sql');
  const sql = await readFile(schemaPath, 'utf8');

  console.log('[migrate] Menjalankan schema.sql ...');
  await pool.query(sql);
  console.log('[migrate] Selesai. Tabel users, cvs, analyses, categories siap.');
}

migrate()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[migrate] Gagal:', err.message);
    pool.end().finally(() => process.exit(1));
  });
