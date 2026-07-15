export type TAdminReview = {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
  } | null;
  courseId: {
    _id: string;
    name: string;
  } | null;
};
