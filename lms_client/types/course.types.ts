export type TCourseData<TInstructorType = string, TModuleType = string> = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  courseCover: string;
  instructors?: TInstructorType[];
  modules?: TModuleType[];
  published: boolean;
};
