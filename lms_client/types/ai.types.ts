export type TReviewSummaryResponse = {
  summary: string;
  totalReviews: number;
  averageRating: number | null;
  generated: boolean;
};

export type TCourseAdvisorRecommendation = {
  courseId: string;
  reason: string;
  name: string;
  category: string;
  price: number;
};

export type TCourseAdvisorResponse = {
  recommendations: TCourseAdvisorRecommendation[];
};
