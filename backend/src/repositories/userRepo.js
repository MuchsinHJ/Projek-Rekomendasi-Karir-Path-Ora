import { query } from '../config/db.js';

const PUBLIC_FIELDS = 'id, email, full_name, headline, created_at, updated_at';

export async function createUser({ email, passwordHash, fullName }) {
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING ${PUBLIC_FIELDS}`,
    [email, passwordHash, fullName ?? null],
  );
  return rows[0];
}

/** Termasuk password_hash (dipakai khusus untuk login). */
export async function findByEmailWithHash(email) {
  const { rows } = await query(
    `SELECT id, email, password_hash, full_name, headline, created_at, updated_at
     FROM users WHERE email = $1`,
    [email],
  );
  return rows[0] || null;
}

export async function findById(id) {
  const { rows } = await query(
    `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function updateProfile(id, { fullName, headline }) {
  const { rows } = await query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         headline  = COALESCE($3, headline),
         updated_at = now()
     WHERE id = $1
     RETURNING ${PUBLIC_FIELDS}`,
    [id, fullName ?? null, headline ?? null],
  );
  return rows[0] || null;
}
