export type TAdminReview = {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  userId: {
    id: string;
    name: string;
  } | null;
  courseId: {
    id: string;
    name: string;
  } | null;
};
