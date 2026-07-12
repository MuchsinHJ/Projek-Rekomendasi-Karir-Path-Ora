import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/httpError.js';

/**
 * Middleware proteksi: membaca Bearer token dari header Authorization,
 * memverifikasi JWT, lalu menempelkan req.user = { id, email }.
 */
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(ApiError.unauthorized('Token autentikasi tidak ditemukan.'));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return next(ApiError.unauthorized('Token tidak valid atau kedaluwarsa.'));
  }
}

export default requireAuth;
