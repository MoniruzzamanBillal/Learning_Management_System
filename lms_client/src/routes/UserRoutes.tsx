import {
  MyCourseCertificates,
  MyEnrolledCourses,
} from "@/pages/Dashboard/user";

export const userRoutes = [
  {
    path: "/dashboard/user/my-enrolled-courses",
    element: <MyEnrolledCourses />,
  },
  {
    path: "/dashboard/user/course-certificates",
    element: <MyCourseCertificates />,
  },
];
