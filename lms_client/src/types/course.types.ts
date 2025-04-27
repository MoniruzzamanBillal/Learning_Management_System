export type TCourseData = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  courseCover: string;
  instructors?: string[];
  modules?: string[];
  published: boolean;
};
