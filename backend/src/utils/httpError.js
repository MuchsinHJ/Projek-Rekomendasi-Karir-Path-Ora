/**
 * Error aplikasi terstandar dengan HTTP status code & kode mesin.
 * Dilempar dari controller/service, ditangkap oleh errorHandler.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {object} [options]
   * @param {string} [options.code] - kode mesin (mis. 'NOT_FOUND')
   * @param {*} [options.details] - detail tambahan (mis. error validasi)
   */
  constructor(statusCode, message, { code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code || httpCodeName(statusCode);
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(msg = 'Bad request', opts) {
    return new ApiError(400, msg, opts);
  }

  static unauthorized(msg = 'Unauthorized', opts) {
    return new ApiError(401, msg, opts);
  }

  static forbidden(msg = 'Forbidden', opts) {
    return new ApiError(403, msg, opts);
  }

  static notFound(msg = 'Resource tidak ditemukan', opts) {
    return new ApiError(404, msg, opts);
  }

  static conflict(msg = 'Conflict', opts) {
    return new ApiError(409, msg, opts);
  }

  static unprocessable(msg = 'Unprocessable entity', opts) {
    return new ApiError(422, msg, opts);
  }
}

function httpCodeName(status) {
  const map = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    500: 'INTERNAL_ERROR',
    502: 'BAD_GATEWAY',
    504: 'GATEWAY_TIMEOUT',
  };
  return map[status] || 'ERROR';
}
