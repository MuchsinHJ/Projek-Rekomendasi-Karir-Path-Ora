import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { pingDb } from '../config/db.js';
import env from '../config/env.js';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import cvRoutes from './cvRoutes.js';
import analysisRoutes from './analysisRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const router = Router();

/** GET /api/v1/health */
router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    let db = false;
    try {
      db = await pingDb();
    } catch {
      db = false;
    }
    return sendSuccess(res, {
      status: 'ok',
      db: db ? 'up' : 'down',
      ai_provider: env.aiProvider,
      timestamp: new Date().toISOString(),
    });
  }),
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cvs', cvRoutes);
router.use('/analyses', analysisRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoryRoutes);

export default router;
