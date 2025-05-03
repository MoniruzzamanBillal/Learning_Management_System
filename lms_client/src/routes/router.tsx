import App from "@/App";

import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { HomePage, Login, Register } from "@/pages";

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
        path: "/sign-up",
        element: <Register />,
      },
      {
        path: "/",
        element: <HomePage />,
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
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <p>Dashboard !!!!</p>,
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
