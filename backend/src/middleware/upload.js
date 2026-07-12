import multer from 'multer';
import env from '../config/env.js';

/**
 * Konfigurasi upload file CV (in-memory) dengan batas ukuran.
 * Parsing isi file ditangani di controller (text/.txt didukung penuh).
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
});

export default upload;
