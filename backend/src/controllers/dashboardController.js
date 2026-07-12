import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as analysisRepo from '../repositories/analysisRepo.js';
import * as cvRepo from '../repositories/cvRepo.js';

/**
 * GET /api/v1/dashboard/me
 * Data untuk Dashboard Utama:
 *  - latest_analysis : ringkasan analisis terakhir (kategori + confidence)
 *  - recent_uploads  : daftar CV terakhir (riwayat upload)
 *  - stats           : total & sukses analisis
 */
export const getMyDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [latest, recentUploads, counts] = await Promise.all([
    analysisRepo.latestForUser(userId),
    cvRepo.listByUser(userId),
    analysisRepo.countByUser(userId),
  ]);

  const latestAnalysis = latest
    ? {
        id: latest.id,
        cv_id: latest.cv_id,
        predicted_category: latest.predicted_category,
        confidence: latest.confidence !== null ? Number(latest.confidence) : null,
        analyzed_at: latest.analyzed_at,
      }
    : null;

  return sendSuccess(res, {
    latest_analysis: latestAnalysis,
    recent_uploads: recentUploads.slice(0, 5),
    stats: {
      total_uploads: recentUploads.length,
      total_analyses: counts.total,
      successful_analyses: counts.success,
    },
  });
});
