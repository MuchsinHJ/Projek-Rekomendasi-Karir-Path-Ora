import React from "react";
import { DashboardSummary } from "../../types/dashboard";

interface Props {
  summary: DashboardSummary | null;
}

const SkorDashboard: React.FC<Props> = ({ summary }) => {
  const latestAnalysis = summary?.latest_analysis;
  const confidence = latestAnalysis
    ? Math.round(latestAnalysis.confidence * 100)
    : 0;
  const category = latestAnalysis?.predicted_category ?? "No Analysis Yet";
  const totalAnalysis = summary?.total_analyses ?? 0;
  const circumference = 2 * Math.PI * 56;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between min-h-[280px]">
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center md:text-left">
        Job Readiness Score
      </h2>

      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#8B6F47"
              strokeWidth="8"
              strokeDasharray={`${(confidence / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">
              {confidence}
            </span>
            <span className="text-xs text-gray-500">/100</span>
          </div>
        </div>

        <h3 className="text-center font-bold text-gray-900 text-sm mb-1">
          {category}
        </h3>
        <p className="text-center text-xs text-gray-400">
          Total Analyses: {totalAnalysis}
        </p>
      </div>
    </div>
  );
};

export default SkorDashboard;
