export type TReviewSummaryResponse = {
  summary: string;
  totalReviews: number;
  averageRating: number | null;
  generated: boolean;
};
