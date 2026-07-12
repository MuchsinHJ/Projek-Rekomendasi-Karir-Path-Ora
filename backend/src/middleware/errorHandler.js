import env from '../config/env.js';
import { ApiError } from '../utils/httpError.js';
import { sendError } from '../utils/apiResponse.js';

/** Handler 404 untuk route yang tidak terdaftar. */
export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route tidak ditemukan: ${req.method} ${req.originalUrl}`));
}

/**
 * Error handler terpusat. Memetakan berbagai jenis error menjadi
 * respons JSON konsisten. Mencegah aplikasi crash (BR-7).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Error operasional yang sudah kita bentuk.
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, {
      code: err.code,
      details: err.details,
    });
  }

  // Error JSON body parser (payload tidak valid).
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'Body JSON tidak valid.', { code: 'INVALID_JSON' });
  }

  // Error upload (Multer).
  if (err.name === 'MulterError') {
    const msg =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran file melebihi batas yang diizinkan.'
        : `Upload gagal: ${err.message}`;
    return sendError(res, 400, msg, { code: err.code });
  }

  // Pelanggaran unique constraint PostgreSQL (mis. email terdaftar).
  if (err.code === '23505') {
    return sendError(res, 409, 'Data sudah terdaftar.', { code: 'DUPLICATE' });
  }

  // Fallback: 500.
  console.error('[error]', err);
  return sendError(res, 500, 'Terjadi kesalahan pada server.', {
    code: 'INTERNAL_ERROR',
    details: env.isProd ? undefined : err.message,
  });
}
