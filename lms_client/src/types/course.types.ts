export type TCourseData<TInstructorType = string, TModuleType = string> = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  courseCover: string;
  instructors?: TInstructorType[];
  modules?: TModuleType[];
  published: boolean;
};
