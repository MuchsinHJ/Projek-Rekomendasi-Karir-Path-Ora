import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/httpError.js';
import { createCvTextSchema } from '../validators/schemas.js';
import * as cvRepo from '../repositories/cvRepo.js';

const MIN_TEXT_LEN = 30;
const TEXT_EXT = /\.(txt|md)$/i;

/**
 * POST /api/v1/cvs
 * Menerima CV via:
 *  - JSON  { raw_text }            -> source_type 'text'
 *  - multipart file (.txt/.md)     -> source_type 'file'
 * PDF/DOCX belum di-parse (extension point) -> 422 dengan pesan jelas.
 */
export const createCv = asyncHandler(async (req, res) => {
  let rawText;
  let sourceType;
  let fileName = null;

  if (req.file) {
    const isText =
      req.file.mimetype?.startsWith('text/') || TEXT_EXT.test(req.file.originalname || '');
    if (!isText) {
      throw ApiError.unprocessable(
        'Format file belum didukung untuk ekstraksi otomatis (PDF/DOCX). ' +
          'Silakan tempel teks CV pada field raw_text.',
        { code: 'UNSUPPORTED_FILE_TYPE' },
      );
    }
    rawText = req.file.buffer.toString('utf8').trim();
    sourceType = 'file';
    fileName = req.file.originalname || 'cv.txt';
    if (rawText.length < MIN_TEXT_LEN) {
      throw ApiError.unprocessable('Isi file CV terlalu pendek (minimal 30 karakter).', {
        code: 'VALIDATION_ERROR',
      });
    }
  } else {
    const parsed = createCvTextSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      throw ApiError.unprocessable('Validasi input gagal.', {
        code: 'VALIDATION_ERROR',
        details,
      });
    }
    rawText = parsed.data.raw_text;
    sourceType = 'text';
  }

  const cv = await cvRepo.createCv({ userId: req.user.id, sourceType, rawText, fileName });
  return sendSuccess(res, cv, { status: 201 });
});

/** GET /api/v1/cvs */
export const listCvs = asyncHandler(async (req, res) => {
  const cvs = await cvRepo.listByUser(req.user.id);
  return sendSuccess(res, cvs, { meta: { count: cvs.length } });
});

/** GET /api/v1/cvs/:cvId */
export const getCv = asyncHandler(async (req, res) => {
  const cv = await cvRepo.findByIdForUser(req.params.cvId, req.user.id);
  if (!cv) throw ApiError.notFound('CV tidak ditemukan.');
  return sendSuccess(res, cv);
});

/** DELETE /api/v1/cvs/:cvId */
export const deleteCv = asyncHandler(async (req, res) => {
  const ok = await cvRepo.deleteForUser(req.params.cvId, req.user.id);
  if (!ok) throw ApiError.notFound('CV tidak ditemukan.');
  return sendSuccess(res, { id: req.params.cvId, deleted: true });
});
