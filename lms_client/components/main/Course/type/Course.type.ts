export type TInstructor = {
  id: string;
  name: string;
};

export type TReview = {
  averageRating: number;
  totalReviews: number;
  id: string;
};

export type TCourse = {
  id: string;
  name: string;
  category: string;
  courseCover: string;
  instructors: TInstructor[];
  price: number;
  reviewData?: TReview;
  modules: string[];

  description: string;
  updatedAt: string;
};
