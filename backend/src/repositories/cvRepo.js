import { query } from '../config/db.js';

const FIELDS = 'id, user_id, source_type, raw_text, file_name, created_at';

export async function createCv({ userId, sourceType, rawText, fileName }) {
  const { rows } = await query(
    `INSERT INTO cvs (user_id, source_type, raw_text, file_name)
     VALUES ($1, $2, $3, $4)
     RETURNING ${FIELDS}`,
    [userId, sourceType, rawText, fileName ?? null],
  );
  return rows[0];
}

/** Daftar CV milik user (tanpa raw_text agar ringan). */
export async function listByUser(userId) {
  const { rows } = await query(
    `SELECT id, user_id, source_type, file_name, created_at,
            LEFT(raw_text, 160) AS preview
     FROM cvs
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );
  return rows;
}

export async function findByIdForUser(id, userId) {
  const { rows } = await query(
    `SELECT ${FIELDS} FROM cvs WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return rows[0] || null;
}

export async function deleteForUser(id, userId) {
  const { rowCount } = await query(
    `DELETE FROM cvs WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return rowCount > 0;
}
