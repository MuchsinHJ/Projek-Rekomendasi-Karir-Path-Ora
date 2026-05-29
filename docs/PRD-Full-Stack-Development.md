# PRD — Path`Ora (Fokus: Full Stack Development)

> **Product Requirements Document**
> Platform End-to-End Kesiapan Kerja dengan Dashboard Strategis & Rekomendasi Jalur Karir Otomatis

| Field | Value |
|---|---|
| **Nama Produk** | Path`Ora |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 29 Mei 2026 |
| **Pemilik Dokumen** | Full-Stack Developer 1 (Backend) & Full-Stack Developer 2 (Frontend) |
| **Status** | Draft untuk Review |
| **Scope Dokumen** | Full Stack Development (Frontend + Backend + Integrasi AI/ML + Deployment) |

---

## 0. Ringkasan Eksekutif

Path`Ora adalah platform web yang membantu pencari kerja (terutama fresh graduate & career switcher di bidang **IT & Data**) memahami tingkat kesiapan kerja mereka dan mendapatkan rekomendasi jalur karir yang relevan berdasarkan analisis CV.

Pengguna mengunggah CV, sistem mengirimkannya ke layanan AI/ML (CV parsing, klasifikasi kategori, skill extraction, rekomendasi karir), lalu hasilnya divisualisasikan dalam dashboard strategis yang informatif.

PRD ini **secara spesifik membatasi cakupan pada peran Full Stack Development**: membangun RESTful API (Express + PostgreSQL), mengintegrasikan output model AI/ML melalui kontrak API yang sudah disepakati, membangun frontend interaktif (React + Vite + TypeScript), dan melakukan deployment. PRD ini **tidak** mencakup detail pembuatan/training model (tanggung jawab Data Scientist & AI Engineer), melainkan **kontrak integrasinya**.

---

## 1. Tujuan Produk

### 1.1 Tujuan Bisnis (Business Goals)
1. Menyediakan platform yang mengubah CV menjadi **insight kesiapan kerja yang actionable** dalam hitungan detik.
2. Menjadi *painkiller* bagi pencari kerja yang kebingungan menentukan arah karir dan tidak tahu skill apa yang kurang.
3. Membuktikan kelayakan integrasi end-to-end Data Science → AI/ML → Web App sebagai produk fungsional.

### 1.2 Tujuan Produk dari Sisi Full Stack
1. **Membangun RESTful API** dengan Express yang mengikuti konvensi REST untuk mendukung seluruh kebutuhan frontend.
2. **Persistensi data** ke PostgreSQL (user, CV, hasil analisis, riwayat).
3. **Mengintegrasikan kemampuan AI/ML** sebagai fitur utama melalui kontrak API Backend–AI yang sudah disepakati, tanpa membuat aplikasi crash bila layanan AI gagal/lambat.
4. **Membangun UI dashboard responsif** dengan visualisasi data (chart kategori, skill match/gap, rekomendasi karir) menggunakan React + Vite.
5. **Networking calls** dari frontend ke backend menggunakan Axios.
6. **Deployment** aplikasi web ke server (Vercel untuk frontend; backend ke layanan yang mendukung Node + Postgres).

### 1.3 Non-Goals (di luar tujuan)
- Membuat/melatih model ML & NLP (domain AI Engineer / Data Scientist).
- Real-time scraping data lowongan kerja.
- Aplikasi mobile native.
- Fitur sosial/komunitas, marketplace, atau pembayaran.

---

## 2. Target Pengguna

### 2.1 Segmen Pengguna
| Segmen | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Fresh Graduate (IT/Data)** | Baru lulus, belum tahu posisi yang cocok | Validasi arah karir & skill gap |
| **Career Switcher** | Pindah ke bidang IT/Data dari bidang lain | Tahu skill yang harus dipelajari |
| **Job Seeker Aktif** | Sedang melamar banyak posisi | Optimasi CV agar sesuai target role |

### 2.2 Persona

**Persona 1 — "Rani, Fresh Graduate Informatika" (Primary)**
- 22 tahun, baru lulus, punya CV tapi bingung apply ke posisi apa.
- *Goal:* Tahu posisi yang paling cocok dan skill yang masih kurang.
- *Pain:* Banyak lowongan, tidak yakin kualifikasi dirinya sesuai yang mana.
- *Ekspektasi UX:* Upload CV → hasil jelas, visual, mudah dimengerti dalam < 1 menit.

**Persona 2 — "Doni, Career Switcher" (Secondary)**
- 27 tahun, dari background non-IT, ingin pindah ke Data Analyst.
- *Goal:* Roadmap skill yang harus dikuasai untuk menembus bidang baru.
- *Pain:* Tidak tahu skill mana yang relevan & seberapa jauh gap-nya.

**Persona 3 — "Admin/Tim Pengembang" (Internal)**
- Memantau jumlah analisis, distribusi kategori, dan kesehatan sistem via dashboard agregat sederhana.

### 2.3 Asumsi Pengguna
- Memiliki CV dalam format teks/PDF.
- Mengakses lewat browser desktop maupun mobile (layout harus responsif).
- Literasi digital dasar; UI harus minim friksi.

---

## 3. Fitur Utama

> Ditandai dengan kepemilikan: **[FE]** Frontend, **[BE]** Backend, **[INT]** Integrasi AI/ML.

### F1. Autentikasi & Manajemen Sesi **[FE][BE]**
- Register, login, logout berbasis JWT.
- Proteksi endpoint privat (CV & analisis milik user).
- *Catatan:* dapat disederhanakan menjadi sesi anonim + token jika waktu terbatas (lihat Prioritas Fitur).

### F2. Upload & Manajemen CV **[FE][BE]**
- Upload CV (teks tempel atau file PDF/DOCX → diekstrak menjadi teks).
- Validasi ukuran & tipe file.
- Riwayat CV yang pernah diunggah per user.

### F3. Analisis CV via AI/ML **[INT][BE]**
- Backend mengirim teks CV ke layanan AI dan menerima respons sesuai **API Contract** (lihat §10).
- Menyimpan hasil analisis ke database.
- Penanganan error: timeout, layanan AI down, respons tidak valid → tidak crash, beri fallback state.

### F4. Dashboard Hasil Analisis **[FE]**
- **Predicted Category** + confidence (badge & gauge).
- **Top Predictions** (bar chart) dengan filter ambang `confidence > 0.05`.
- **Skill Match vs Skill Gap** per kategori (matched_skills dengan similarity, missing_skills).
- **Career Recommendations** dengan filter `match_score > 0.3`.
- **Deskripsi naratif** rekomendasi karir (teks dari LLM).

### F5. Visualisasi Data Strategis **[FE]**
- Chart kategori, radar/skill bar, progress kesiapan kerja.
- Insight ringkas ("Kamu cocok untuk Information Technology dengan keyakinan 83%").

### F6. Riwayat & Detail Analisis **[FE][BE]**
- Daftar analisis sebelumnya.
- Buka kembali detail analisis tertentu.

### F7. Dashboard Agregat (Admin/Internal) **[FE][BE]** *(opsional/P2)*
- Total CV dianalisis, distribusi kategori prediksi, rata-rata confidence.

---

## 4. Kebutuhan Bisnis (Business Requirements)

| ID | Kebutuhan | Pemenuhan Kriteria Proyek |
|---|---|---|
| BR-1 | Frontend dibangun dengan module bundler **Vite** | ✅ Wajib |
| BR-2 | **Networking calls** ke API (Axios) | ✅ Wajib |
| BR-3 | **RESTful API** dengan **Express** | ✅ Wajib |
| BR-4 | API menyimpan data ke **PostgreSQL** | ✅ Wajib |
| BR-5 | URL API mengikuti **konvensi RESTful** | ✅ Wajib |
| BR-6 | Integrasi kemampuan **AI/ML** sebagai fitur utama | ✅ Wajib |
| BR-7 | Fitur utama berjalan **tanpa crash** (resilient) | ✅ Wajib |
| BR-8 | **Mockup** UI dibuat sebagai representasi desain | ✅ Wajib |
| BR-9 | Layout **responsif** lintas ukuran layar | ✅ Wajib |
| BR-10 | **Deployment** ke server (frontend: Vercel) | ✅ Wajib |
| BR-11 | Styling dengan **Tailwind CSS** (rekomendasi) | ⭐ Rekomendasi |

---

## 5. Scope Proyek

### 5.1 In Scope (Full Stack)
- Frontend SPA: React + TypeScript + Vite + Tailwind CSS + Axios.
- Backend RESTful API: Node.js + Express + PostgreSQL.
- Integrasi ke layanan AI/ML melalui HTTP berdasarkan API Contract.
- Autentikasi JWT, manajemen CV, penyimpanan & penyajian hasil analisis.
- Dashboard interaktif + visualisasi (chart library, mis. Recharts/Chart.js).
- Mockup/wireframe UI.
- Responsive design (mobile, tablet, desktop).
- Deployment frontend (Vercel) & backend (Railway/Render/Fly.io + Postgres terkelola).
- Dokumentasi API (mis. OpenAPI/Swagger atau README endpoint).

### 5.2 Out of Scope (Full Stack)
- Training, tuning, dan pembuatan model ML/NLP (AI Engineer & Data Scientist).
- Pipeline data science (preprocessing, EDA, feature engineering).
- Real-time scraping lowongan kerja.
- Mobile app native.
- Fitur pembayaran, notifikasi push, integrasi pihak ketiga (LinkedIn, dll).

### 5.3 Batasan & Asumsi
- Dataset hanya CV dari Kaggle; kategori difokuskan pada bidang IT & Data (model bisa mengembalikan kategori lain seperti ENGINEERING, FINANCE, dll sesuai contract).
- Model bersifat baseline–menengah; latensi inferensi diasumsikan beberapa detik → perlu loading state & timeout handling.
- Layanan AI tersedia sebagai endpoint HTTP terpisah (microservice) yang dipanggil backend. Bila belum siap, backend menyediakan **mock response** sesuai contract untuk pengembangan paralel.

---

## 6. Prioritas Fitur

Menggunakan kerangka **MoSCoW** + label rilis (P0 = MVP wajib demo, P1 = penting, P2 = nice-to-have).

| Prioritas | Fitur | Justifikasi |
|---|---|---|
| **P0 — Must Have** | F2 Upload CV (teks), F3 Analisis via AI, F4 Dashboard hasil, BR-1..BR-10 | Inti nilai produk & pemenuhan kriteria wajib |
| **P0 — Must Have** | Resiliensi integrasi AI (timeout, fallback, no-crash) | Kriteria "tidak crash" |
| **P1 — Should Have** | F1 Autentikasi JWT, F6 Riwayat analisis, F5 Visualisasi lanjutan, Upload file PDF/DOCX | Meningkatkan kualitas produk & personalisasi |
| **P2 — Could Have** | F7 Dashboard agregat admin, ekspor PDF hasil, dark mode, i18n | Penyempurnaan, tidak menghambat demo |
| **Won't (saat ini)** | Mobile native, scraping, pembayaran, social login | Di luar scope/batasan proyek |

**Rekomendasi urutan eksekusi:** Skeleton FE+BE → Schema DB → Endpoint CV & Analyze (dengan mock AI) → Dashboard + chart → Auth → Integrasi AI nyata → Polish responsif → Deploy.

---

## 7. User Flow Umum

### 7.1 Flow Utama — Analisis CV
```
[Landing Page]
      │  klik "Analisis CV Saya"
      ▼
[Register / Login]  ──(mode anonim opsional)──┐
      │                                        │
      ▼                                        ▼
[Halaman Upload CV] ◀───────────────────────────
      │  tempel teks / unggah file (PDF/DOCX)
      │  klik "Analisis"
      ▼
[FE → POST /cvs]  simpan CV  →  [BE]
      │
      ▼
[FE → POST /cvs/:id/analyze]
      │     [BE → layanan AI/ML (HTTP)]
      │            │  (timeout/retry handling)
      │            ▼
      │     [AI mengembalikan hasil sesuai contract]
      │            │
      │     [BE simpan hasil ke Postgres]
      ▼
[Loading State / Skeleton]  ←  polling/await respons
      │
      ▼
[Dashboard Hasil]
   • Predicted category + confidence (gauge/badge)
   • Top predictions (bar chart, filter > 0.05)
   • Skill match vs gap per kategori
   • Career recommendations (filter > 0.3)
   • Deskripsi naratif rekomendasi
      │
      ├─► [Simpan ke Riwayat]
      └─► [Analisis CV Lain]
```

### 7.2 Flow Sekunder — Lihat Riwayat
```
[Dashboard] → [Menu Riwayat] → GET /analyses → [List Analisis]
   → pilih item → GET /analyses/:id → [Detail Dashboard]
```

### 7.3 Penanganan Kegagalan (Resiliensi)
```
POST /cvs/:id/analyze
   ├─ AI timeout (> N detik)   → status 504 → FE tampilkan "Coba lagi" (tidak crash)
   ├─ AI error / 5xx           → status 502 → fallback pesan + tombol retry
   ├─ Respons tidak valid       → validasi schema gagal → 422 + log
   └─ Sukses                    → 200 + simpan + tampilkan
```

---

## 8. Arsitektur Sistem (High Level)

```
┌──────────────────────────┐        HTTPS (Axios)        ┌────────────────────────────┐
│  Frontend (Vercel)       │ ───────────────────────────▶│  Backend RESTful API        │
│  React + Vite + TS       │ ◀───────────────────────────│  Node.js + Express          │
│  Tailwind + Recharts     │         JSON                 │  - Auth (JWT)               │
└──────────────────────────┘                              │  - CV & Analysis service    │
                                                           │  - Validasi & error handling│
                                                           └───────────┬─────────────────┘
                                                                       │
                                              ┌────────────────────────┼───────────────────────┐
                                              ▼                        ▼                         ▼
                                    ┌──────────────────┐   ┌────────────────────────┐  ┌──────────────────┐
                                    │ PostgreSQL       │   │ AI/ML Service (HTTP)    │  │ Object Storage   │
                                    │ users, cvs,      │   │ CV parsing, klasifikasi,│  │ (file CV opsional)│
                                    │ analyses (JSONB) │   │ skill extraction, reco  │  └──────────────────┘
                                    └──────────────────┘   └────────────────────────┘
```

**Catatan integrasi:** Backend adalah satu-satunya yang berbicara ke layanan AI. Frontend tidak pernah memanggil AI langsung. Selama AI belum siap, backend memakai **adapter/mock** yang mengembalikan payload sesuai API Contract.

### 8.1 Tech Stack
| Layer | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router, Recharts/Chart.js |
| Backend | Node.js, Express, JWT, Multer (upload), Joi/Zod (validasi), pg/Prisma |
| Database | PostgreSQL |
| Integrasi AI | HTTP client (axios/fetch) dengan timeout + retry |
| Deployment | Vercel (FE), Railway/Render (BE+Postgres) |
| Tooling | ESLint, Prettier, dotenv, Swagger/OpenAPI |

---

## 9. Desain RESTful API (Konvensi REST)

Base URL: `/api/v1`

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registrasi user | ❌ |
| `POST` | `/auth/login` | Login → JWT | ❌ |
| `GET` | `/users/me` | Profil user saat ini | ✅ |
| `POST` | `/cvs` | Upload CV (teks/file) → `cv_id` | ✅ |
| `GET` | `/cvs` | Daftar CV milik user | ✅ |
| `GET` | `/cvs/:cvId` | Detail satu CV | ✅ |
| `DELETE` | `/cvs/:cvId` | Hapus CV | ✅ |
| `POST` | `/cvs/:cvId/analyze` | Trigger analisis AI, simpan hasil | ✅ |
| `GET` | `/cvs/:cvId/analysis` | Hasil analisis terbaru dari CV | ✅ |
| `GET` | `/analyses` | Riwayat analisis user | ✅ |
| `GET` | `/analyses/:analysisId` | Detail satu analisis (sesuai contract) | ✅ |
| `GET` | `/categories` | Data referensi kategori karir | ❌ |
| `GET` | `/dashboard/summary` | Agregat (opsional/admin) | ✅ |
| `GET` | `/health` | Health check | ❌ |

**Konvensi:** kata benda jamak, plural resource, nesting wajar (`/cvs/:cvId/analyze`), status code tepat (200/201/400/401/404/422/502/504), respons konsisten `{ data, error, meta }`.

---

## 10. API Contract Backend ↔ AI (Disepakati)

Respons hasil analisis yang disimpan & disajikan backend:

```json
{
  "cv_id": "uuid-abc123",
  "analyzed_at": "2025-01-15T10:30:00Z",
  "predicted_category": "INFORMATION-TECHNOLOGY",
  "confidence": 0.832,
  "top_5_predictions": [
    { "category": "INFORMATION-TECHNOLOGY", "confidence": 0.832 },
    { "category": "ENGINEERING", "confidence": 0.075 }
  ],
  "extracted_skills": [
    {
      "category": "INFORMATION-TECHNOLOGY",
      "matched_skills": [
        { "skill": "Python", "similarity": 0.92 },
        { "skill": "TensorFlow", "similarity": 0.89 }
      ],
      "missing_skills": ["Project Management", "Salesforce"]
    }
  ],
  "career_recommendations": [
    { "category": "INFORMATION-TECHNOLOGY", "match_score": 0.832 }
  ],
  "description_career_recommendations": "Based on the predicted category and extracted skills, ..."
}
```

**Aturan filtering yang ditangani Full Stack (BE memvalidasi, FE menampilkan):**
- `top_5_predictions`: hanya tampilkan item dengan `confidence > 0.05`.
- `career_recommendations`: hanya tampilkan item dengan `match_score > 0.3`.
- Skill `matched_skills` diurutkan menurun berdasarkan `similarity`.
- Bila array kosong setelah filter → tampilkan empty state yang informatif.

---

## 11. Model Data (PostgreSQL)

Pendekatan: kolom ternormalisasi untuk metadata + **JSONB** untuk payload hasil AI agar fleksibel terhadap perubahan model.

```sql
-- users
id            UUID PK
email         TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
full_name     TEXT
created_at    TIMESTAMPTZ DEFAULT now()

-- cvs
id            UUID PK
user_id       UUID FK -> users(id)
source_type   TEXT            -- 'text' | 'file'
raw_text      TEXT
file_url      TEXT NULL
created_at    TIMESTAMPTZ DEFAULT now()

-- analyses
id             UUID PK
cv_id          UUID FK -> cvs(id)
user_id        UUID FK -> users(id)
status         TEXT            -- 'pending'|'success'|'failed'
predicted_category TEXT
confidence     NUMERIC(5,4)
result         JSONB           -- payload penuh sesuai API contract
analyzed_at    TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()

-- categories (referensi)
code           TEXT PK         -- 'INFORMATION-TECHNOLOGY'
display_name   TEXT
description     TEXT
```

Index: `analyses(user_id)`, `analyses(cv_id)`, `analyses(predicted_category)`, GIN index pada `result`.

---

## 12. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| **Resiliensi** | Kegagalan AI tidak meng-crash app; selalu ada fallback & retry (BR-7) |
| **Performa FE** | First load < 3 dtk pada koneksi normal; bundle dioptimasi Vite |
| **Latensi API** | Endpoint non-AI < 300 ms; endpoint analyze tergantung AI + timeout konfigurabel (mis. 30 dtk) |
| **Responsif** | Breakpoint mobile (≤640px), tablet (641–1024px), desktop (>1024px) |
| **Keamanan** | Password hash (bcrypt), JWT, validasi input, CORS, rate limiting dasar |
| **Observability** | Logging request/error, `/health` endpoint |
| **Aksesibilitas** | Kontras memadai, label aria pada elemen interaktif |
| **Dokumentasi** | OpenAPI/Swagger atau README endpoint lengkap |

---

## 13. Mockup & Desain UI

Mockup wajib dibuat (BR-8) minimal untuk layar:
1. **Landing Page** — value proposition + CTA "Analisis CV".
2. **Auth** — login/register.
3. **Upload CV** — area tempel teks / drag-drop file + tombol Analisis.
4. **Loading/Processing** — skeleton & progress.
5. **Dashboard Hasil** — gauge confidence, bar chart prediksi, skill match/gap, kartu rekomendasi karir, deskripsi naratif.
6. **Riwayat** — daftar analisis.
7. **Empty & Error states**.

Tool mockup yang disarankan: Figma. Aset warna & komponen mengikuti design system Tailwind (spacing, radius, palet konsisten).

---

## 14. Kriteria Keberhasilan Produk

### 14.1 Acceptance Criteria (Demo MVP)
- [ ] Pengguna dapat mengunggah CV (minimal teks) dan menerima hasil analisis tervisualisasi.
- [ ] Frontend dibangun & di-bundle dengan **Vite**, styling **Tailwind**, networking via **Axios**.
- [ ] Backend **Express** menyediakan RESTful API berkonvensi & menyimpan data ke **PostgreSQL**.
- [ ] Fitur utama (analisis AI) **terintegrasi** dan **tidak crash** saat AI gagal/timeout.
- [ ] Dashboard menampilkan predicted category, top predictions (filter >0.05), skill match/gap, dan career recommendations (filter >0.3) + deskripsi naratif.
- [ ] Layout **responsif** di mobile, tablet, desktop.
- [ ] Aplikasi **ter-deploy** (FE di Vercel, BE + Postgres di server).
- [ ] **Mockup** UI tersedia.

### 14.2 Metrik Keberhasilan (KPI)
| Metrik | Target |
|---|---|
| Tingkat keberhasilan analisis (sukses/total) | ≥ 95% (di luar kegagalan AI) |
| Crash rate fitur utama | 0 crash saat AI gagal (graceful) |
| Waktu dari upload → hasil tampil (mock AI) | < 2 dtk |
| Lighthouse Performance (FE) | ≥ 80 |
| Lighthouse Responsive/Best Practices | ≥ 90 |
| Endpoint sesuai konvensi REST | 100% |
| Kepuasan pengguna uji (skala 1–5) | ≥ 4 |

### 14.3 Definition of Done
- Kode lulus lint & build (`vite build`, `tsc`).
- API terdokumentasi & teruji manual (Postman/Thunder Client).
- Error handling & loading state untuk seluruh call AI.
- Deployed URL dapat diakses publik.
- README cara menjalankan FE & BE lokal + variabel environment.

---

## 15. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Layanan AI belum siap saat integrasi | Blokir pengembangan FE/BE | Sediakan **mock adapter** sesuai API contract sejak awal |
| Latensi/timeout inferensi AI | UX buruk, app terasa hang | Timeout konfigurabel, loading state, retry, status `pending` |
| Skema hasil AI berubah | Bug parsing di FE/BE | Simpan payload sebagai **JSONB** + validasi schema (Zod/Joi) |
| Upload file PDF/DOCX gagal di-parse | Analisis gagal | Validasi tipe/ukuran + fallback ke input teks |
| Deployment Postgres berbeda env | Error koneksi | Gunakan env vars & Postgres terkelola, uji staging |

---

## 16. Milestone & Pembagian Kerja Full Stack

| Sprint | Fokus | Owner |
|---|---|---|
| Sprint 0 | Setup repo, Vite scaffold, Tailwind, struktur Express, schema DB, mockup | FE Dev 2 + BE Dev 1 |
| Sprint 1 | Endpoint CV & analyze (mock AI), dashboard skeleton + chart | FE Dev 2 + BE Dev 1 |
| Sprint 2 | Auth JWT, riwayat, visualisasi lengkap, error/loading handling | FE Dev 2 + BE Dev 1 |
| Sprint 3 | Integrasi AI nyata, responsif final, deployment, dokumentasi | FE Dev 2 + BE Dev 1 |

---

*Dokumen ini berfokus pada peran Full Stack Development. Detail pemodelan ML/NLP, pipeline data science, dan evaluasi model berada pada dokumen terpisah milik Data Scientist & AI Engineer; PRD ini hanya mengikat pada kontrak integrasi (§10).*
