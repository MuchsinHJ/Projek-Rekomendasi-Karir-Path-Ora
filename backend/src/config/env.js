import dotenv from 'dotenv';

dotenv.config();

/**
 * Konfigurasi terpusat & tervalidasi untuk seluruh aplikasi.
 * Variabel yang wajib divalidasi di-cek pada saat boot (validateEnv()).
 */
const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  pgSsl: String(process.env.PGSSL || 'false').toLowerCase() === 'true',

  // Auth
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // AI service
  aiProvider: (process.env.AI_PROVIDER || 'mock').toLowerCase(),
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000/analyze',
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,

  // Upload
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,
};

env.isProd = env.nodeEnv === 'production';

/**
 * Validasi variabel kritikal. Dipanggil saat server start.
 * Tidak menghentikan proses di mode development agar mudah dijalankan,
 * tetapi memberi peringatan jelas.
 */
export function validateEnv() {
  const warnings = [];
  const errors = [];

  const hasDbUrl = Boolean(env.databaseUrl);
  const hasPgParts = Boolean(env.pg.host && env.pg.user && env.pg.database);
  if (!hasDbUrl && !hasPgParts) {
    errors.push('DATABASE_URL atau (PGHOST, PGUSER, PGDATABASE) wajib diisi.');
  }

  if (env.isProd && env.jwtSecret === 'dev-only-insecure-secret-change-me') {
    errors.push('JWT_SECRET wajib di-set untuk production.');
  } else if (env.jwtSecret === 'dev-only-insecure-secret-change-me') {
    warnings.push('JWT_SECRET memakai nilai default dev. Set JWT_SECRET di .env.');
  }

  if (!['mock', 'http'].includes(env.aiProvider)) {
    warnings.push(`AI_PROVIDER "${env.aiProvider}" tidak dikenal, fallback ke "mock".`);
    env.aiProvider = 'mock';
  }

  return { warnings, errors };
}

export default env;
