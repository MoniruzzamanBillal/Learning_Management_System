import App from "@/App";

import { createBrowserRouter } from "react-router-dom";

import { HomePage, Login, ManageCourse, Register } from "@/pages";
import DashboardLayout from "@/components/layout/DashboardLayout";

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
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <p>Dashboard !!!!</p>,
          },
          {
            path: "/dashboard/admin/manage-course",
            element: <ManageCourse />,
          },
        ],
      },
    ],
  },
]);

export default router;
