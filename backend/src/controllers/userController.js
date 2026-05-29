import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/httpError.js';
import * as userRepo from '../repositories/userRepo.js';

/** GET /api/v1/users/me */
export const getMe = asyncHandler(async (req, res) => {
  const user = await userRepo.findById(req.user.id);
  if (!user) throw ApiError.notFound('User tidak ditemukan.');
  return sendSuccess(res, user);
});

/** PATCH /api/v1/users/me */
export const updateMe = asyncHandler(async (req, res) => {
  const { full_name: fullName, headline } = req.body;
  const user = await userRepo.updateProfile(req.user.id, { fullName, headline });
  if (!user) throw ApiError.notFound('User tidak ditemukan.');
  return sendSuccess(res, user);
});
