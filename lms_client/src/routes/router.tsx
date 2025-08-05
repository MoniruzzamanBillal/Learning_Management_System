import App from "@/App";

import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ChangePassword,
  CourseDetail,
  Courses,
  EnrollFail,
  EnrollSuccess,
  HomePage,
  Login,
  Register,
  UpdateProfile,
  UserProfile,
} from "@/pages";

import { ContactUs } from "@/components/ui";
import { EnrolledCourseDetail, MyCourses } from "@/pages/user";
import { adminRoutes } from "./AdminRoutes";
import { InstructorRoutes } from "./InstructorRoutes";
import { userRoutes } from "./UserRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/sign-up",
        element: <Register />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/course-detail/:courseId",
        element: <CourseDetail />,
      },
      {
        path: "/my-courses",
        element: <MyCourses />,
      },
      {
        path: "/my-enrolled-course-detail/:courseId",
        element: <EnrolledCourseDetail />,
      },
      {
        path: "/courseEnroll-success",
        element: <EnrollSuccess />,
      },
      {
        path: "/courseEnroll-fail",
        element: <EnrollFail />,
      },

      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard/profile",
            element: <UserProfile />,
          },
          {
            path: "/dashboard/update-profile/:userId",
            element: <UpdateProfile />,
          },

          // * admin routes
          ...adminRoutes,

          // * instructor routes
          ...InstructorRoutes,

          // * user routes
          ...userRoutes,

          //
        ],
      },
    ],
  },
]);

export default router;
