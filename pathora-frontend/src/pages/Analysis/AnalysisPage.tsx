import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import {
  ChevronLeft,
  ChevronRight,
  Plane,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "../../hooks/useAnalysis";
import { analysisService } from "../../services/analysis.service";
import { Analysis } from "../../types/analysis";
import { parseApiError } from "../../utils/error";

const AnalysisPage: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const detailState = useAnalysis(analysisId);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const isDetailMode = !!analysisId;
  const analysis = isDetailMode
    ? detailState.analysis
    : analyses[currentIndex] ?? null;
  const isLoading = isDetailMode ? detailState.isLoading : isListLoading;
  const error = isDetailMode ? detailState.error : listError;
  const result = analysis?.result;
  const topPredictions = result?.top_predictions ?? [];
  const matchedSkills = result?.matched_skills ?? [];
  const missingSkills = result?.missing_skills ?? [];
  const totalAnalyses = analyses.length;

  useEffect(() => {
    if (isDetailMode) return;

    const fetchAnalyses = async () => {
      setListLoading(true);
      setListError(null);

      try {
        const result = await analysisService.getAllAnalyses();
        setAnalyses(result);
        setCurrentIndex(0);
      } catch (error) {
        setListError(parseApiError(error));
      } finally {
        setListLoading(false);
      }
    };

    fetchAnalyses();
  }, [isDetailMode]);

  const goToPrevious = () => {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((current) => Math.min(current + 1, totalAnalyses - 1));
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Loading analysis results...
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen text-red-600">
          {error}
        </div>
      </AppLayout>
    );
  }

  if (!analysis || !result) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Analysis data was not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F7F6F2] px-4 sm:px-6 lg:px-10 pt-4 lg:pt-0 pb-8 font-['Newsreader']">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-5">
            <div className="min-w-0 lg:max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-bold font-['Newsreader'] text-gray-900 leading-tight">
                CV Analysis Results
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base leading-6 font-['Manrope',_sans-serif]">
                {isDetailMode
                  ? "Here are the CV analysis results based on the CV data you selected."
                  : "Use pagination to view the analysis results for each of your CVs."}
              </p>
            </div>

            <div className="w-full lg:w-auto bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 lg:min-w-[260px]">
              <div className="w-14 h-14 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-[#102619]">
                  {Math.round(result.confidence * 100)}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 leading-4">
                  Top Career Prediction Score
                </p>
                <p className="font-medium text-[#102619] break-words">
                  {result.predicted_category}
                </p>
              </div>
            </div>
          </div>

          {!isDetailMode && totalAnalyses > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-[#102619]">
                  CV {currentIndex + 1} of {totalAnalyses}
                </p>
                <p className="text-xs text-gray-500">
                  {analysis?.created_at
                    ? new Date(analysis.created_at).toLocaleDateString("en-US")
                    : "Analysis date is not available"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#102619] px-4 py-2 text-sm text-[#102619] hover:bg-[#102619] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentIndex >= totalAnalyses - 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#102619] px-4 py-2 text-sm text-[#102619] hover:bg-[#102619] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-8 lg:mb-10">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 sm:mb-6">
                <h2 className="font-serif text-xl sm:text-2xl text-[#102619]">
                  Career Predictions
                </h2>
                <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {topPredictions.length > 0 ? (
                  topPredictions.map((prediction) => {
                    const score =
                      prediction.confidence ?? prediction.score ?? 0;
                    return (
                      <div key={prediction.category}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{prediction.category}</span>
                          <span>{Math.round(score * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1E3A2B] rounded-full"
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400">
                    Prediction distribution is not available yet.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <Plane className="w-5 h-5 text-[#102619]" />
                <h2 className="font-serif text-xl sm:text-2xl text-[#102619]">
                  Skill Analysis: {result.predicted_category}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                    Existing Skills
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 rounded-full bg-green-100 text-[#1E3A2B] text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No data
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                    Skills to Add
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No data
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9FAF7] border border-[#E8E8E0] rounded-2xl p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <Sparkles className="w-5 h-5 text-[#102619]" />
              <h2 className="font-serif text-2xl sm:text-3xl text-[#102619]">
                Path'Ora Strategic Recommendations
              </h2>
            </div>

            <div className="max-w-4xl">
              <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 whitespace-pre-line">
                {result.description_career_recommendations ||
                  "No recommendation narrative is available for this analysis yet."}
              </p>

              <Link
                to={`/career-recommendations/${analysis.id}`}
                className="inline-block mt-6 sm:mt-8 px-5 sm:px-8 py-3 border border-[#102619] rounded-lg text-sm sm:text-base text-[#102619] hover:bg-[#102619] hover:text-white transition"
              >
                VIEW DETAILED ACTION PLAN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalysisPage;
