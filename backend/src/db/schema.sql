-- ============================================================
-- Path'Ora - Skema Database (PostgreSQL)
-- Aman dijalankan berulang (idempotent).
-- ============================================================

-- Untuk gen_random_uuid() pada PostgreSQL < 13 / kompatibilitas luas.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- users ----------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  headline      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- cvs ----------
CREATE TABLE IF NOT EXISTS cvs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('text', 'file')),
  raw_text    TEXT NOT NULL,
  file_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- analyses ----------
CREATE TABLE IF NOT EXISTS analyses (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id              UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'success', 'failed')),
  predicted_category TEXT,
  confidence         NUMERIC(5, 4),
  result             JSONB,          -- payload penuh sesuai API Contract Backend<->AI
  error_message      TEXT,
  analyzed_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- categories (referensi) ----------
CREATE TABLE IF NOT EXISTS categories (
  code         TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  description  TEXT
);

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs (user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_cv_id ON analyses (cv_id);
CREATE INDEX IF NOT EXISTS idx_analyses_predicted_category ON analyses (predicted_category);
CREATE INDEX IF NOT EXISTS idx_analyses_result_gin ON analyses USING GIN (result);
