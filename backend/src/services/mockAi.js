/**
 * Mock AI/ML engine untuk analisis CV.
 *
 * TIDAK memiliki dependency eksternal (hanya data kategori) sehingga bisa
 * dijalankan & diuji standalone tanpa database / Express:
 *   node scripts/test-ai-adapter.js
 *
 * Output mengikuti API Contract Backend <-> AI (PRD §10):
 *   cv_id, analyzed_at, predicted_category, confidence, top_5_predictions,
 *   extracted_skills, career_recommendations, description_career_recommendations
 */

import { CATEGORIES, CATEGORY_DISPLAY } from '../data/categories.js';

const MAX_TOP_PREDICTIONS = 5;
const MAX_MISSING_SKILLS = 4;

/** Hash string deterministik (FNV-1a) -> uint32. */
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Similarity deterministik untuk skill yang cocok (rentang 0.62 - 0.95). */
function pseudoSimilarity(skill) {
  const v = hashString(skill.toLowerCase()) % 34; // 0..33
  return Number((0.62 + v / 100).toFixed(2));
}

function round(n, digits = 3) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

/** Cek apakah skill muncul di teks (case-insensitive, batas kata wajar). */
function skillFoundIn(textLower, skill) {
  return textLower.includes(skill.toLowerCase());
}

/**
 * Menganalisis teks CV dan menghasilkan payload sesuai kontrak.
 * @param {{ cvId?: string, text?: string }} input
 * @returns {object} payload analisis
 */
export function analyzeMock({ cvId = null, text = '' } = {}) {
  const textLower = String(text || '').toLowerCase();

  // 1) Hitung skill yang cocok per kategori.
  const perCategory = CATEGORIES.map((cat) => {
    const matched = cat.skills.filter((s) => skillFoundIn(textLower, s));
    const missing = cat.skills.filter((s) => !skillFoundIn(textLower, s));
    return { code: cat.code, matched, missing, matchedCount: matched.length };
  });

  // 2) Skor mentah -> bobot (smooth, tidak terlalu tajam) -> normalisasi.
  const weights = perCategory.map((c) => (c.matchedCount + 0.05) ** 1.5);
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

  const scored = perCategory
    .map((c, i) => ({ ...c, confidence: round(weights[i] / totalWeight, 3) }))
    .sort((a, b) => b.confidence - a.confidence);

  // 3) Top predictions.
  const topPredictions = scored
    .slice(0, MAX_TOP_PREDICTIONS)
    .map((c) => ({ category: c.code, confidence: c.confidence }));

  const predicted = scored[0];

  // 4) extracted_skills untuk seluruh kategori pada top predictions.
  const extractedSkills = scored
    .slice(0, MAX_TOP_PREDICTIONS)
    .map((c) => ({
      category: c.code,
      matched_skills: c.matched
        .map((skill) => ({ skill, similarity: pseudoSimilarity(skill) }))
        .sort((a, b) => b.similarity - a.similarity),
      missing_skills: c.missing.slice(0, MAX_MISSING_SKILLS),
    }));

  // 5) career_recommendations (match_score = confidence; transform memfilter >0.3).
  const careerRecommendations = scored.map((c) => ({
    category: c.code,
    match_score: c.confidence,
  }));

  // 6) Deskripsi naratif (template; pada mode http akan datang dari LLM).
  const description = buildDescription(scored, extractedSkills);

  return {
    cv_id: cvId,
    analyzed_at: new Date().toISOString(),
    predicted_category: predicted.code,
    confidence: predicted.confidence,
    top_5_predictions: topPredictions,
    extracted_skills: extractedSkills,
    career_recommendations: careerRecommendations,
    description_career_recommendations: description,
  };
}

function buildDescription(scored, extractedSkills) {
  const top = scored[0];
  const second = scored[1];
  const topDisplay = CATEGORY_DISPLAY[top.code] || top.code;
  const topSkills = (extractedSkills[0]?.matched_skills || [])
    .slice(0, 3)
    .map((s) => s.skill);
  const topMissing = (extractedSkills[0]?.missing_skills || []).slice(0, 3);

  if (topSkills.length === 0) {
    return (
      `The CV does not yet show strong signals for a specific category. ` +
      `The closest match is ${topDisplay}. Consider adding concrete, ` +
      `measurable skills and project experience to strengthen your profile.`
    );
  }

  let desc =
    `Based on the predicted category and extracted skills, the most suitable ` +
    `career path is in ${topDisplay}. Your strongest skills include ` +
    `${topSkills.join(', ')}.`;

  if (topMissing.length > 0) {
    desc += ` To broaden your opportunities, consider strengthening ${topMissing.join(', ')}.`;
  }
  if (second && second.confidence > 0.1) {
    desc += ` There are also relevant opportunities in ${CATEGORY_DISPLAY[second.code] || second.code}.`;
  }
  return desc;
}

export default analyzeMock;
