/**
 * Aturan filtering tampilan (PRD §10):
 *  - top_5_predictions  : tampilkan hanya confidence > 0.05
 *  - career_recommendations : tampilkan hanya match_score > 0.3
 *  - matched_skills     : urut menurun berdasarkan similarity
 *
 * Data tersimpan di DB tetap utuh; filtering diterapkan saat menyajikan ke FE.
 */

const MIN_PREDICTION_CONFIDENCE = 0.05;
const MIN_CAREER_MATCH_SCORE = 0.3;

export function transformAnalysisResult(result) {
  if (!result || typeof result !== 'object') return result;

  const top = Array.isArray(result.top_5_predictions)
    ? result.top_5_predictions.filter((p) => Number(p.confidence) > MIN_PREDICTION_CONFIDENCE)
    : [];

  const career = Array.isArray(result.career_recommendations)
    ? result.career_recommendations.filter((c) => Number(c.match_score) > MIN_CAREER_MATCH_SCORE)
    : [];

  const extracted = Array.isArray(result.extracted_skills)
    ? result.extracted_skills.map((e) => ({
        ...e,
        matched_skills: Array.isArray(e.matched_skills)
          ? [...e.matched_skills].sort(
              (a, b) => Number(b.similarity) - Number(a.similarity),
            )
          : [],
      }))
    : [];

  return {
    ...result,
    top_5_predictions: top,
    career_recommendations: career,
    extracted_skills: extracted,
  };
}

export default transformAnalysisResult;
