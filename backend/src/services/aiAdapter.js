import env from '../config/env.js';
import { analyzeMock } from './mockAi.js';

/** Error: layanan AI melewati batas waktu (timeout). */
export class AiTimeoutError extends Error {
  constructor(message = 'Layanan AI tidak merespons (timeout).') {
    super(message);
    this.name = 'AiTimeoutError';
  }
}

/** Error: layanan AI gagal / tidak tersedia / respons tidak valid. */
export class AiServiceError extends Error {
  constructor(message = 'Layanan AI gagal memproses permintaan.') {
    super(message);
    this.name = 'AiServiceError';
  }
}

/**
 * Titik integrasi tunggal ke AI/ML. Frontend TIDAK pernah memanggil AI langsung.
 *
 * Mode dikontrol via env.aiProvider:
 *  - 'mock' : pakai mock engine bawaan (default, untuk dev paralel).
 *  - 'http' : panggil layanan AI nyata via HTTP (fetch + timeout).
 *
 * @param {{ cvId: string, text: string }} input
 * @returns {Promise<object>} payload sesuai API Contract
 */
export async function analyzeCv({ cvId, text }) {
  if (env.aiProvider === 'http') {
    return analyzeViaHttp({ cvId, text });
  }
  // Default: mock. Bungkus dalam Promise agar antarmuka konsisten (async).
  return analyzeMock({ cvId, text });
}

async function analyzeViaHttp({ cvId, text }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.aiTimeoutMs);

  let res;
  try {
    res = await fetch(env.aiServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cv_id: cvId, text }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new AiTimeoutError();
    }
    throw new AiServiceError(`Tidak dapat menghubungi layanan AI: ${err.message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new AiServiceError(`Layanan AI merespons status ${res.status}.`);
  }

  let payload;
  try {
    payload = await res.json();
  } catch {
    throw new AiServiceError('Respons layanan AI bukan JSON yang valid.');
  }

  validateAiPayload(payload);
  return payload;
}

/** Validasi minimal payload AI agar tidak merusak downstream. */
function validateAiPayload(p) {
  const ok =
    p &&
    typeof p.predicted_category === 'string' &&
    typeof p.confidence === 'number' &&
    Array.isArray(p.top_5_predictions) &&
    Array.isArray(p.extracted_skills) &&
    Array.isArray(p.career_recommendations);
  if (!ok) {
    throw new AiServiceError('Struktur respons AI tidak sesuai kontrak.');
  }
}

export default analyzeCv;
