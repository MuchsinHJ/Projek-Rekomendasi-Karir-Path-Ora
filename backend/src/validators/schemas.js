import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email('Email tidak valid.'),
  password: z.string().min(8, 'Password minimal 8 karakter.'),
  full_name: z.string().trim().min(1).max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email tidak valid.'),
  password: z.string().min(1, 'Password wajib diisi.'),
});

export const updateProfileSchema = z
  .object({
    full_name: z.string().trim().min(1).max(120).optional(),
    headline: z.string().trim().max(160).optional(),
  })
  .refine((d) => d.full_name !== undefined || d.headline !== undefined, {
    message: 'Minimal satu field (full_name atau headline) harus diisi.',
  });

// Upload via teks. Upload via file ditangani Multer (multipart), bukan skema ini.
export const createCvTextSchema = z.object({
  raw_text: z.string().trim().min(30, 'Teks CV terlalu pendek (minimal 30 karakter).'),
});
