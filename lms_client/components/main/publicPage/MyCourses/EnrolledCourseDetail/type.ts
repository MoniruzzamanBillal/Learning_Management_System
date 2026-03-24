export type TModule = {
  _id: string;
  title: string;
  videos: string[];
};

export type TCourse = {
  _id: string;
  name: string;
  category: string;
  modules: TModule[];
};

export type TEnrollCourseDetail = {
  _id: string;
  user: string;
  course: TCourse;
  Payment: string;
  completed: boolean;
  courseProgressData: number;
};
