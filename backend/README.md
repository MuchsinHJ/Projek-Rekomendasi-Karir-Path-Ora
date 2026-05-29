# Path`Ora — Backend API

RESTful API untuk platform Path`Ora (analisis CV, klasifikasi kategori karir, skill gap, & rekomendasi karir). Dibangun dengan **Node.js + Express + PostgreSQL**, terintegrasi dengan layanan AI/ML melalui adapter (mode `mock` atau `http`).

## Tech Stack

- **Runtime:** Node.js >= 18 (ESM)
- **Framework:** Express 4
- **Database:** PostgreSQL (driver `pg`)
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs`
- **Validasi:** Zod
- **Upload:** Multer
- **Keamanan:** Helmet, CORS

## Struktur Folder

```
backend/
├── scripts/
│   └── test-ai-adapter.js     # uji mock AI (tanpa DB/Express)
└── src/
    ├── app.js                 # konfigurasi Express
    ├── server.js              # entry point
    ├── config/                # env & koneksi DB
    ├── controllers/           # handler request
    ├── data/                  # data referensi kategori + skill bank
    ├── db/                    # schema.sql, migrate, seed
    ├── middleware/            # auth, error, validate, upload, asyncHandler
    ├── repositories/          # akses data (SQL)
    ├── routes/                # definisi endpoint
    ├── services/              # aiAdapter, mockAi, transform
    ├── utils/                 # jwt, password, response, error
    └── validators/            # skema Zod
```

## Setup Cepat

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment
cp .env.example .env
#    -> sesuaikan DATABASE_URL & JWT_SECRET

# 3. Pastikan PostgreSQL berjalan & database sudah dibuat
#    contoh: createdb pathora

# 4. Migrasi skema + seed kategori
npm run db:setup        # = db:migrate + db:seed

# 5. Jalankan server (dev, auto-reload)
npm run dev
#    -> http://localhost:4000/api/v1/health
```

## Script NPM

| Script | Fungsi |
|---|---|
| `npm run dev` | Jalankan server dengan nodemon |
| `npm start` | Jalankan server (produksi) |
| `npm run db:migrate` | Buat/selaraskan tabel dari `schema.sql` |
| `npm run db:seed` | Isi tabel `categories` |
| `npm run db:setup` | Migrate + seed |
| `npm run test:ai` | Uji mock AI engine (tanpa DB) |

## Environment Variables

Lihat `.env.example`. Yang penting:

| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `4000` | Port server |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin frontend (pisahkan koma) |
| `DATABASE_URL` | — | Connection string Postgres |
| `JWT_SECRET` | — | Wajib di production |
| `AI_PROVIDER` | `mock` | `mock` atau `http` |
| `AI_SERVICE_URL` | — | URL layanan AI (mode `http`) |
| `AI_TIMEOUT_MS` | `30000` | Timeout panggilan AI |

## Integrasi AI/ML

Backend adalah **satu-satunya** yang memanggil layanan AI (frontend tidak pernah langsung).

- **`AI_PROVIDER=mock`** (default): memakai engine bawaan di `src/services/mockAi.js`. Cocok untuk pengembangan FE/BE paralel tanpa menunggu tim AI. Output **100% sesuai API Contract**.
- **`AI_PROVIDER=http`**: backend memanggil `AI_SERVICE_URL` via HTTP `POST { cv_id, text }` dengan timeout & validasi schema. Kegagalan dipetakan ke `502` (AI bermasalah) atau `504` (timeout) — aplikasi tidak crash.

Bentuk respons AI mengikuti kontrak (lihat `docs/PRD-Full-Stack-Development.md` §10).

## Daftar Endpoint (Base: `/api/v1`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/health` | ❌ | Health check (status DB & AI provider) |
| `POST` | `/auth/register` | ❌ | Registrasi (`email`, `password`, `full_name?`) |
| `POST` | `/auth/login` | ❌ | Login → JWT |
| `GET` | `/users/me` | ✅ | Profil/biodata user |
| `PATCH` | `/users/me` | ✅ | Update biodata (`full_name`, `headline`) |
| `GET` | `/dashboard/me` | ✅ | Ringkasan analisis terakhir + riwayat upload |
| `POST` | `/cvs` | ✅ | Upload CV (`raw_text` JSON atau file `.txt`) |
| `GET` | `/cvs` | ✅ | Daftar CV milik user |
| `GET` | `/cvs/:cvId` | ✅ | Detail CV |
| `DELETE` | `/cvs/:cvId` | ✅ | Hapus CV |
| `POST` | `/cvs/:cvId/analyze` | ✅ | Jalankan analisis AI & simpan |
| `GET` | `/cvs/:cvId/analysis` | ✅ | Analisis terbaru sebuah CV |
| `GET` | `/analyses` | ✅ | Riwayat analisis (`?limit=n`) |
| `GET` | `/analyses/:analysisId` | ✅ | Detail satu analisis |
| `GET` | `/categories` | ❌ | Referensi kategori karir |

Format respons konsisten: `{ "data": ..., "error": null }` (sukses) atau `{ "data": null, "error": { "message", "code", "details?" } }` (gagal).

## Contoh Alur (curl)

```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"rani@example.com","password":"password123","full_name":"Rani"}'

# Simpan TOKEN dari respons, lalu upload CV
curl -X POST http://localhost:4000/api/v1/cvs \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"raw_text":"Machine Learning Engineer skilled in Python, TensorFlow, PyTorch, SQL, Docker, AWS."}'

# Analisis CV (pakai cv_id dari respons sebelumnya)
curl -X POST http://localhost:4000/api/v1/cvs/<CV_ID>/analyze \
  -H "Authorization: Bearer $TOKEN"
```

## Catatan

- Upload **PDF/DOCX** belum di-parse otomatis (extension point); gunakan teks atau file `.txt`. Endpoint mengembalikan `422` yang jelas, bukan crash.
- Tabel: `users`, `cvs`, `analyses` (payload AI disimpan sebagai `JSONB`), `categories`.
- Aturan tampilan (filter `confidence > 0.05`, `match_score > 0.3`) diterapkan saat menyajikan data; data tersimpan tetap utuh.
