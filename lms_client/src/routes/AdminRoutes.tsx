import { AddCourse } from "@/pages";
import {
  CourseDetail,
  ManageCourse,
  ManageModule,
  ModuleDetail,
} from "@/pages/Dashboard/admin";

export const adminRoutes = [
  {
    path: "/dashboard/admin/manage-course",
    element: <ManageCourse />,
  },
  {
    path: "/dashboard/admin/add-course",
    element: <AddCourse />,
  },
  {
    path: "/dashboard/admin/course-detail/:id",
    element: <CourseDetail />,
  },
  {
    path: "/dashboard/admin/manage-modules",
    element: <ManageModule />,
  },
  {
    path: "/dashboard/admin/module-detail/:id",
    element: <ModuleDetail />,
  },
];
