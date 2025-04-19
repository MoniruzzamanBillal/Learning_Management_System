import { AddCourse } from "@/pages";
import {
  CourseDetail,
  ManageCourse,
  ManageModule,
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
    path: "/dashboard/admin/manage-modules",
    element: <ManageModule />,
  },
  {
    path: "/dashboard/admin/course-detail/:id",
    element: <CourseDetail />,
  },
];
