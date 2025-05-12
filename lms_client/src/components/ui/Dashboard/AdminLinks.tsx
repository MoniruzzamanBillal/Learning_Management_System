import { CiBookmark } from "react-icons/ci";

export const adminLinks = [
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
    name: "Manage Instructors",
    path: "/dashboard/admin/manage-instructor",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Manage Courses",
    path: "/dashboard/admin/manage-course",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Manage Modules",
    path: "/dashboard/admin/manage-modules",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: " Enrollment ",
    path: "/dashboard/admin/enroll-courses",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
];
