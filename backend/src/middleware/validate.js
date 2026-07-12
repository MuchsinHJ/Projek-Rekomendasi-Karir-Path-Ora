import { ApiError } from '../utils/httpError.js';

/**
 * Middleware validasi berbasis Zod.
 * @param {import('zod').ZodTypeAny} schema - skema untuk req.body
 * @param {'body'|'query'|'params'} [source='body']
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(
        ApiError.unprocessable('Validasi input gagal.', {
          code: 'VALIDATION_ERROR',
          details,
        }),
      );
    }
    // Ganti dengan data tervalidasi & ter-coerce.
    req[source] = result.data;
    return next();
  };
}

export default validate;
