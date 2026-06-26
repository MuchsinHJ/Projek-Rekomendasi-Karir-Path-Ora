import React from "react";
import { MapPin } from "lucide-react";

export interface JobRecommendation {
  id: number;
  title: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
}

interface JobRecommendationCardProps {
  job: JobRecommendation;
}

const JobRecommendationCard: React.FC<JobRecommendationCardProps> = ({
  job,
}) => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-['Newsreader'] text-[#102619] leading-tight break-words">
          {job.title}
        </h2>
      </div>

      <div className="w-fit bg-[#F3F1EB] px-3 sm:px-4 py-2 sm:py-3 rounded-full flex items-center gap-2 shrink-0">
        <MapPin size={14} className="text-[#102619] shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-[#102619] whitespace-nowrap">
          {job.matchPercentage}% Match
        </span>
      </div>
    </div>

    <div className="mt-5 space-y-5 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-gray-600 sm:min-w-[140px] sm:pt-2">
          Matching Skills
        </p>
        <span className="hidden sm:inline sm:pt-2">:</span>
        <div className="flex flex-wrap gap-2">
          {job.matchingSkills.length > 0 ? (
            job.matchingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 sm:px-4 py-2 rounded-full bg-green-100 text-[#102619] text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">Not available</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-gray-600 sm:min-w-[140px] sm:pt-2">
          Skills to Add
        </p>
        <span className="hidden sm:inline sm:pt-2">:</span>
        <div className="flex flex-wrap gap-2">
          {job.missingSkills.length > 0 ? (
            job.missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 sm:px-4 py-2 rounded-full bg-orange-200 text-[#8B5A2B] text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">
              No additional skills needed
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default JobRecommendationCard;
