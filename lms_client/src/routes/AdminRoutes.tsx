import {
  AddCourse,
  AddInstructor,
  CourseDetail,
  Enrollment,
  ManageCourse,
  ManageInstructors,
  ManageModule,
  ModuleDetail,
} from "@/pages/Dashboard/admin";

export const adminRoutes = [
  {
    path: "/dashboard/admin/manage-instructor",
    element: <ManageInstructors />,
  },
  {
    path: "/dashboard/admin/add-instructor",
    element: <AddInstructor />,
  },
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
  {
    path: "/dashboard/admin/enroll-courses",
    element: <Enrollment />,
  },
];
