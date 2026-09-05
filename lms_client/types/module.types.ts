export type TModuleData<
  TCourse = string,
  TInstructor = string,
  TVideo = string
> = {
  id: string;
  course: TCourse;
  title: string;
  videos?: TVideo[];
  instructor?: TInstructor[];
  isDeleted?: boolean;
};
