import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Membuat JWT untuk user.
 * @param {{ id: string, email: string }} user
 */
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

/**
 * Memverifikasi & mendekode JWT. Melempar bila tidak valid/expired.
 * @param {string} token
 */
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
