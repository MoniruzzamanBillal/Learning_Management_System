import {
  InstructorModule,
  ManageAssignCourse,
  ManageModule,
  ManageVideo,
} from "@/pages/Dashboard/instructor";

export const InstructorRoutes = [
  {
    path: "/dashboard/instructor/assign-courses",
    element: <ManageAssignCourse />,
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
    path: "/dashboard/instructor/manage-video",
    element: <ManageVideo />,
  },
];
