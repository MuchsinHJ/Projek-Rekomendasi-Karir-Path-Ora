import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/** Hash password plaintext. */
export function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Bandingkan plaintext dengan hash tersimpan. */
export function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
