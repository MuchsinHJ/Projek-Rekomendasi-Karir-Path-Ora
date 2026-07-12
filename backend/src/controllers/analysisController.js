import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/httpError.js';
import * as cvRepo from '../repositories/cvRepo.js';
import * as analysisRepo from '../repositories/analysisRepo.js';
import { analyzeCv, AiTimeoutError, AiServiceError } from '../services/aiAdapter.js';
import { transformAnalysisResult } from '../services/analysisTransform.js';

/** Bentuk respons analisis lengkap (dengan result yang sudah difilter). */
function formatAnalysis(row) {
  return {
    id: row.id,
    cv_id: row.cv_id,
    status: row.status,
    predicted_category: row.predicted_category,
    confidence: row.confidence !== null ? Number(row.confidence) : null,
    analyzed_at: row.analyzed_at,
    created_at: row.created_at,
    result: row.result ? transformAnalysisResult(row.result) : null,
  };
}

/**
 * POST /api/v1/cvs/:cvId/analyze
 * Memicu analisis AI untuk sebuah CV. Resilient: kegagalan AI -> 502/504,
 * tidak meng-crash aplikasi (BR-7).
 */
export const analyze = asyncHandler(async (req, res) => {
  const cv = await cvRepo.findByIdForUser(req.params.cvId, req.user.id);
  if (!cv) throw ApiError.notFound('CV tidak ditemukan.');

  const pending = await analysisRepo.createPending({ cvId: cv.id, userId: req.user.id });

  let result;
  try {
    result = await analyzeCv({ cvId: cv.id, text: cv.raw_text });
  } catch (err) {
    await analysisRepo.markFailed(pending.id, err.message);
    if (err instanceof AiTimeoutError) {
      throw new ApiError(504, 'Layanan AI tidak merespons tepat waktu. Silakan coba lagi.', {
        code: 'AI_TIMEOUT',
      });
    }
    if (err instanceof AiServiceError) {
      throw new ApiError(502, 'Layanan AI sedang bermasalah. Silakan coba lagi.', {
        code: 'AI_UNAVAILABLE',
      });
    }
    throw err;
  }

  const saved = await analysisRepo.markSuccess(pending.id, {
    predictedCategory: result.predicted_category,
    confidence: result.confidence,
    result,
    analyzedAt: result.analyzed_at || new Date().toISOString(),
  });

  return sendSuccess(res, formatAnalysis(saved), { status: 201 });
});

/** GET /api/v1/cvs/:cvId/analysis - analisis terbaru sebuah CV. */
export const getLatestForCv = asyncHandler(async (req, res) => {
  const cv = await cvRepo.findByIdForUser(req.params.cvId, req.user.id);
  if (!cv) throw ApiError.notFound('CV tidak ditemukan.');

  const analysis = await analysisRepo.latestForCv(cv.id, req.user.id);
  if (!analysis) throw ApiError.notFound('Belum ada analisis untuk CV ini.');

  return sendSuccess(res, formatAnalysis(analysis));
});

/** GET /api/v1/analyses - riwayat analisis user (ringkasan). */
export const listAnalyses = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Math.min(Number(req.query.limit) || 0, 100) : undefined;
  const rows = await analysisRepo.listByUser(req.user.id, { limit });
  const data = rows.map((r) => ({
    id: r.id,
    cv_id: r.cv_id,
    status: r.status,
    predicted_category: r.predicted_category,
    confidence: r.confidence !== null ? Number(r.confidence) : null,
    analyzed_at: r.analyzed_at,
    created_at: r.created_at,
  }));
  return sendSuccess(res, data, { meta: { count: data.length } });
});

/** GET /api/v1/analyses/:analysisId - detail satu analisis. */
export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await analysisRepo.findByIdForUser(req.params.analysisId, req.user.id);
  if (!analysis) throw ApiError.notFound('Analisis tidak ditemukan.');
  return sendSuccess(res, formatAnalysis(analysis));
});
