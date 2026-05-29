import pool from '../config/db.js';
import { CATEGORIES } from '../data/categories.js';

/**
 * Mengisi tabel categories dengan data referensi.
 * Idempotent: memakai UPSERT (ON CONFLICT).
 */
async function seed() {
  console.log('[seed] Mengisi tabel categories ...');

  for (const c of CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (code, display_name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (code)
       DO UPDATE SET display_name = EXCLUDED.display_name,
                     description   = EXCLUDED.description`,
      [c.code, c.display_name, c.description],
    );
  }

  console.log(`[seed] Selesai. ${CATEGORIES.length} kategori tersimpan.`);
}

seed()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] Gagal:', err.message);
    pool.end().finally(() => process.exit(1));
  });
