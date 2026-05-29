/**
 * Uji standalone mock AI engine TANPA database / Express / dependency npm.
 * Jalankan: node scripts/test-ai-adapter.js
 *
 * Memverifikasi:
 *  - struktur output sesuai API Contract
 *  - jumlah top_5_predictions <= 5
 *  - confidence ternormalisasi (jumlah ~ 1)
 *  - aturan filtering transform (>0.05 dan >0.3)
 */

import { analyzeMock } from '../src/services/mockAi.js';
import { transformAnalysisResult } from '../src/services/analysisTransform.js';

const SAMPLE_CV = `
John Doe - Machine Learning Engineer
Skills: Python, TensorFlow, PyTorch, Pandas, NumPy, Scikit-learn, SQL, Docker, AWS, Git
Experience: Built deep learning models and NLP pipelines. Strong in data visualization
and statistics. Deployed REST API services using Node.js and Express.
`;

let failures = 0;
function assert(cond, label) {
  const status = cond ? 'PASS' : 'FAIL';
  if (!cond) failures += 1;
  console.log(`  [${status}] ${label}`);
}

console.log('=== Mock AI Adapter Test ===\n');

const raw = analyzeMock({ cvId: 'test-cv-001', text: SAMPLE_CV });

console.log('--- Raw payload ---');
console.log(JSON.stringify(raw, null, 2));

console.log('\n--- Assertions (raw) ---');
assert(typeof raw.predicted_category === 'string', 'predicted_category is string');
assert(typeof raw.confidence === 'number', 'confidence is number');
assert(Array.isArray(raw.top_5_predictions), 'top_5_predictions is array');
assert(raw.top_5_predictions.length <= 5, 'top_5_predictions length <= 5');
assert(Array.isArray(raw.extracted_skills), 'extracted_skills is array');
assert(Array.isArray(raw.career_recommendations), 'career_recommendations is array');
assert(
  typeof raw.description_career_recommendations === 'string' &&
    raw.description_career_recommendations.length > 0,
  'description is non-empty string',
);

const sumConf = raw.career_recommendations.reduce((a, c) => a + c.match_score, 0);
assert(Math.abs(sumConf - 1) < 0.05, `confidence sum ~ 1 (got ${sumConf.toFixed(3)})`);

assert(
  raw.predicted_category === 'DATA-SCIENCE' || raw.predicted_category === 'INFORMATION-TECHNOLOGY',
  `predicted category is IT/Data for ML CV (got ${raw.predicted_category})`,
);

console.log('\n--- Assertions (transform / filtering) ---');
const view = transformAnalysisResult(raw);
assert(
  view.top_5_predictions.every((p) => p.confidence > 0.05),
  'every shown prediction confidence > 0.05',
);
assert(
  view.career_recommendations.every((c) => c.match_score > 0.3),
  'every shown career recommendation match_score > 0.3',
);
const firstMatched = view.extracted_skills[0]?.matched_skills || [];
const sortedDesc = firstMatched.every(
  (s, i) => i === 0 || firstMatched[i - 1].similarity >= s.similarity,
);
assert(sortedDesc, 'matched_skills sorted by similarity desc');

console.log('\n--- Empty CV (resilience) ---');
const empty = analyzeMock({ cvId: 'empty', text: '' });
assert(typeof empty.predicted_category === 'string', 'empty CV still returns a category');
assert(empty.top_5_predictions.length > 0, 'empty CV still returns predictions');

console.log('');
if (failures === 0) {
  console.log('ALL TESTS PASSED ✅');
  process.exit(0);
} else {
  console.log(`${failures} TEST(S) FAILED ❌`);
  process.exit(1);
}
