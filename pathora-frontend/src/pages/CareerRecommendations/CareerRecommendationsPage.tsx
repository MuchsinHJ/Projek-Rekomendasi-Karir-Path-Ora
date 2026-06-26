import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import JobRecommendationCard from "./Job";
import { useCareerRecs } from "../../hooks/useCareerRecs";
import { analysisService } from "../../services/analysis.service";
import { Analysis } from "../../types/analysis";
import { parseApiError } from "../../utils/error";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CareerRecommendationsPage: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const detailState = useCareerRecs(analysisId);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const isDetailMode = !!analysisId;
  const analysis = isDetailMode
    ? detailState.analysis
    : analyses[currentIndex] ?? null;
  const isLoading = isDetailMode ? detailState.isLoading : isListLoading;
  const recommendations = analysis?.result?.career_recommendations ?? [];
  const fallbackMatchedSkills = analysis?.result?.matched_skills ?? [];
  const fallbackMissingSkills = analysis?.result?.missing_skills ?? [];
  const error = isDetailMode ? detailState.error : listError;
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F4F9F4] px-4 sm:px-6 lg:px-10 pt-4 lg:pt-0 pb-8 font-['Newsreader']">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-5 sm:mb-6 lg:mb-7 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Newsreader'] text-gray-900 leading-tight">
              Career Paths
            </h1>
            <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base lg:text-sm font-['Manrope',_sans-serif] leading-6">
              {isDetailMode
                ? "Here are career path recommendations based on the CV analysis you selected."
                : "Based on your skill analysis and professional background, we have prepared high-potential career paths tailored to your profile."}
            </p>
          </div>

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm text-gray-600 font-['Manrope',_sans-serif]">
              Loading career path recommendations...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 font-['Manrope',_sans-serif]">
              {error}
            </div>
          )}

          {!isLoading && !error && analysis && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm mb-5 sm:mb-6 font-['Manrope',_sans-serif]">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#102619]">
                Main Analysis Result
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <span className="text-gray-500 text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">Career Category</span>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-[#102619] mt-1 break-words">
                    {analysis.predicted_category}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">
                    Confidence Score
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-[#A27A53] mt-1 font-['Newsreader']">
                    {(analysis.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Section (Responsif) */}
          {!isDetailMode && !isLoading && !error && totalAnalyses > 0 && (
            <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-4 shadow-sm font-['Manrope',_sans-serif]">
              <div>
                <p className="text-sm font-bold text-[#102619]">
                  CV {currentIndex + 1} of {totalAnalyses}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analysis?.created_at
                    ? new Date(analysis.created_at).toLocaleDateString("en-US")
                    : "Analysis date is not available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:items-center sm:w-auto">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="justify-center inline-flex items-center gap-2 rounded-lg border border-[#102619] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#102619] hover:bg-[#102619] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentIndex >= totalAnalyses - 1}
                  className="justify-center inline-flex items-center gap-2 rounded-lg border border-[#102619] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#102619] hover:bg-[#102619] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Render Recommendations List */}
          {!isLoading && !error && (
            <div className="space-y-4 lg:space-y-6">
              {recommendations.length > 0 ? (
                recommendations.map((career, index) => (
                  <JobRecommendationCard
                    key={`${career.category}-${index}`}
                    job={{
                      id: index,
                      title: career.category,
                      matchPercentage: Math.round(career.match_score * 100),
                      matchingSkills:
                        career.matched_skills?.length > 0
                          ? career.matched_skills
                          : fallbackMatchedSkills,
                      missingSkills:
                        career.missing_skills?.length > 0
                          ? career.missing_skills
                          : fallbackMissingSkills,
                    }}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm text-gray-500 font-['Manrope',_sans-serif]">
                  No career path recommendations are available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CareerRecommendationsPage;
