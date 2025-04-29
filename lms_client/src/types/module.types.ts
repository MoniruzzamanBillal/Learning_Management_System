export type TModuleData<
  TCourse = string,
  TInstructor = string,
  TVideo = string
> = {
  _id: string;
  course: TCourse;
  title: string;
  videos?: TVideo[];
  instructor?: TInstructor[];
  isDeleted?: boolean;
};
