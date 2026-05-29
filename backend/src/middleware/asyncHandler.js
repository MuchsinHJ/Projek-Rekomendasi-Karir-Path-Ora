/**
 * Membungkus controller async agar error otomatis diteruskan ke next()
 * (menghindari try/catch berulang & mencegah unhandled rejection -> crash).
 * @param {Function} fn
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
