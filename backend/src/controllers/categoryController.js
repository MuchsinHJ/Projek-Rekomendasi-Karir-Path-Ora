import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as categoryRepo from '../repositories/categoryRepo.js';

/** GET /api/v1/categories - data referensi kategori karir (publik). */
export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await categoryRepo.listAll();
  return sendSuccess(res, categories, { meta: { count: categories.length } });
});
