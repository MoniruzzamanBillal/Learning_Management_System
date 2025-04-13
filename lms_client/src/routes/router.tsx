import App from "@/App";

import { createBrowserRouter } from "react-router-dom";

import { HomePage, Login, Register } from "@/pages";
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
        ],
      },
    ],
  },
]);

export default router;
