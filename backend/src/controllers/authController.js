import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/httpError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import * as userRepo from '../repositories/userRepo.js';

/** POST /api/v1/auth/register */
export const register = asyncHandler(async (req, res) => {
  const { email, password, full_name: fullName } = req.body;

  const existing = await userRepo.findByEmailWithHash(email);
  if (existing) {
    throw ApiError.conflict('Email sudah terdaftar.', { code: 'EMAIL_TAKEN' });
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({ email, passwordHash, fullName });
  const token = signToken(user);

  return sendSuccess(res, { user, token }, { status: 201 });
});

/** POST /api/v1/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepo.findByEmailWithHash(email);
  if (!user) {
    throw ApiError.unauthorized('Email atau password salah.', { code: 'INVALID_CREDENTIALS' });
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw ApiError.unauthorized('Email atau password salah.', { code: 'INVALID_CREDENTIALS' });
  }

  const token = signToken(user);
  const { password_hash, ...safeUser } = user;
  return sendSuccess(res, { user: safeUser, token });
});
