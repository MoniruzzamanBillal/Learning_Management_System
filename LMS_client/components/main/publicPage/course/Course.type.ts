export type TInstructor = {
  _id: string;
  name: string;
};

export type TReview = {
  averageRating: number;
  totalReviews: number;
  _id: string;
};

export type TCourse = {
  _id: string;
  name: string;
  category: string;
  courseCover: string;
  instructors: TInstructor[];
  price: number;
  reviewData?: TReview;
};
