import { CiBookmark } from "react-icons/ci";

export const InstructorLinks = [
  {
    name: "Home",
    path: "/",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Assigned Courses",
    path: "/dashboard/instructor/assign-courses",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Manage Modules",
    path: "/dashboard/instructor/manage-module",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  // {
  //   name: "Manage Videos",
  //   path: "/dashboard/instructor/manage-video",
  //   icon: <CiBookmark className="text-xl font-bold" />,
  // },
];
