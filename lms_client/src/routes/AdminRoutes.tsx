import {
  AddCourse,
  AddInstructor,
  AdminStatistics,
  CourseDetail,
  Enrollment,
  ManageCourse,
  ManageInstructors,
  ManageModule,
  ModuleDetail,
  UpdateCourse,
} from "@/pages/Dashboard/admin";

export const adminRoutes = [
  {
    path: "/dashboard/admin/home",
    element: <AdminStatistics />,
  },
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
    path: "/dashboard/admin/update-course/:courseId",
    element: <UpdateCourse />,
  },
  {
    path: "/dashboard/admin/course-detail/:courseId",
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
