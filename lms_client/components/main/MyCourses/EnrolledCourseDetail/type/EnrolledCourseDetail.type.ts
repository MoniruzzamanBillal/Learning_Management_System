export type TModule = {
  id: string;
  title: string;
  videos: string[];
};

export type TCourse = {
  id: string;
  name: string;
  category: string;
  modules: TModule[];
};

export type TEnrollCourseDetail = {
  id: string;
  userId: string;
  course: TCourse;
  paymentId: string;
  completed: boolean;
  courseProgressData: number;
};
