import { query } from '../config/db.js';

export async function listAll() {
  const { rows } = await query(
    `SELECT code, display_name, description FROM categories ORDER BY display_name`,
  );
  return rows;
}
