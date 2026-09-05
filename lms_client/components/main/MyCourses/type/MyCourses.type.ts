export type TUserEnrolledCourse = {
  id: string;
  completed: boolean;
  courseProgress: number;
  userId: string;

  course: {
    id: string;
    name: string;
    category: string;
    courseCover: string;
  };
};
