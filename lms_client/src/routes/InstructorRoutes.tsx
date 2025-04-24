import {
  AddModule,
  AddVideo,
  AssignCourseDetail,
  InstructorModule,
  InstructorVideoDetail,
  ManageAssignCourse,
  ManageModule,
  ManageVideo,
  UpdateModule,
} from "@/pages/Dashboard/instructor";

export const InstructorRoutes = [
  {
    path: "/dashboard/instructor/assign-courses",
    element: <ManageAssignCourse />,
  },
  {
    path: "/dashboard/instructor/assign-course-detail/:courseId",
    element: <AssignCourseDetail />,
  },
  {
    path: "/dashboard/instructor/manage-module",
    element: <ManageModule />,
  },
  {
    path: "/dashboard/instructor/module-detail/:moduleId",
    element: <InstructorModule />,
  },
  {
    path: "/dashboard/instructor/add-module",
    element: <AddModule />,
  },
  {
    path: "/dashboard/instructor/update-module/:moduleId",
    element: <UpdateModule />,
  },
  {
    path: "/dashboard/instructor/manage-video",
    element: <ManageVideo />,
  },
  {
    path: "/dashboard/instructor/video-detail/:videoId",
    element: <InstructorVideoDetail />,
  },
  {
    path: "/dashboard/instructor/add-video/:moduleId",
    element: <AddVideo />,
  },
];
