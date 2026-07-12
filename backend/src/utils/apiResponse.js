/**
 * Format respons API yang konsisten: { data, error, meta }
 * (Sesuai konvensi pada PRD §9.)
 */

/**
 * Kirim respons sukses.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {object} [options]
 * @param {number} [options.status=200]
 * @param {object} [options.meta]
 */
export function sendSuccess(res, data, { status = 200, meta } = {}) {
  return res.status(status).json({
    data,
    error: null,
    ...(meta ? { meta } : {}),
  });
}

/**
 * Kirim respons error.
 * @param {import('express').Response} res
 * @param {number} status
 * @param {string} message
 * @param {object} [options]
 * @param {string} [options.code]
 * @param {*} [options.details]
 */
export function sendError(res, status, message, { code, details } = {}) {
  return res.status(status).json({
    data: null,
    error: {
      message,
      code: code || 'ERROR',
      ...(details ? { details } : {}),
    },
  });
}
