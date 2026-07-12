import { query } from '../config/db.js';

const SUMMARY_FIELDS =
  'id, cv_id, user_id, status, predicted_category, confidence, error_message, analyzed_at, created_at';

/** Membuat baris analisis dengan status pending. */
export async function createPending({ cvId, userId }) {
  const { rows } = await query(
    `INSERT INTO analyses (cv_id, user_id, status)
     VALUES ($1, $2, 'pending')
     RETURNING ${SUMMARY_FIELDS}`,
    [cvId, userId],
  );
  return rows[0];
}

export async function markSuccess(id, { predictedCategory, confidence, result, analyzedAt }) {
  const { rows } = await query(
    `UPDATE analyses
     SET status = 'success',
         predicted_category = $2,
         confidence = $3,
         result = $4,
         analyzed_at = $5,
         error_message = NULL
     WHERE id = $1
     RETURNING ${SUMMARY_FIELDS}, result`,
    [id, predictedCategory, confidence, result, analyzedAt],
  );
  return rows[0];
}

export async function markFailed(id, errorMessage) {
  const { rows } = await query(
    `UPDATE analyses
     SET status = 'failed', error_message = $2
     WHERE id = $1
     RETURNING ${SUMMARY_FIELDS}`,
    [id, errorMessage],
  );
  return rows[0];
}

export async function findByIdForUser(id, userId) {
  const { rows } = await query(
    `SELECT ${SUMMARY_FIELDS}, result
     FROM analyses WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return rows[0] || null;
}

/** Analisis sukses terbaru untuk sebuah CV. */
export async function latestForCv(cvId, userId) {
  const { rows } = await query(
    `SELECT ${SUMMARY_FIELDS}, result
     FROM analyses
     WHERE cv_id = $1 AND user_id = $2
     ORDER BY created_at DESC
     LIMIT 1`,
    [cvId, userId],
  );
  return rows[0] || null;
}

export async function latestForUser(userId) {
  const { rows } = await query(
    `SELECT ${SUMMARY_FIELDS}, result
     FROM analyses
     WHERE user_id = $1 AND status = 'success'
     ORDER BY analyzed_at DESC NULLS LAST, created_at DESC
     LIMIT 1`,
    [userId],
  );
  return rows[0] || null;
}

export async function listByUser(userId, { limit } = {}) {
  const params = [userId];
  let sql = `SELECT ${SUMMARY_FIELDS}
             FROM analyses
             WHERE user_id = $1
             ORDER BY created_at DESC`;
  if (limit) {
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
  }
  const { rows } = await query(sql, params);
  return rows;
}

export async function countByUser(userId) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'success')::int AS success
     FROM analyses WHERE user_id = $1`,
    [userId],
  );
  return rows[0];
}
