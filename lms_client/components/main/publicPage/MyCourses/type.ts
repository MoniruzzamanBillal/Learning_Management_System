export type TUserEnrolledCourse = {
  _id: string;
  completed: boolean;
  courseProgress: number;
  user: string;

  course: {
    _id: string;
    name: string;
    category: string;
    courseCover: string;
  };
};
