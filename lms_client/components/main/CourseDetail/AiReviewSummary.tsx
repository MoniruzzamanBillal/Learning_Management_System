"use client";

import { useFetchData } from "@/hooks/useApi";
import { TReviewSummaryResponse } from "@/types/ai.types";
import { Sparkles } from "lucide-react";

type TProps = {
  courseId: string;
};

const AiReviewSummary = ({ courseId }: TProps) => {
  const { data: summaryData, isLoading } = useFetchData<TReviewSummaryResponse>(
    [`ai-review-summary-${courseId}`],
    `/ai/review-summary/${courseId}`,
    {
      enabled: !!courseId,
    },
  );

  if (isLoading) {
    return (
      <div className="bg-muted p-4 my-5 rounded-md shadow animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!summaryData?.data?.generated) {
    return null;
  }

  const { summary, averageRating, totalReviews } = summaryData.data;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 my-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-prime-100 size-4" />
        <span className="font-semibold text-gray-900 text-sm">
          What students are saying
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{summary}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {averageRating !== null && (
          <span className="flex items-center gap-1">
            <span>★</span>
            <span>{averageRating.toFixed(1)}</span>
          </span>
        )}
        <span>{totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
};

export default AiReviewSummary;
