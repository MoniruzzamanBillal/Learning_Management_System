import { CiBookmark } from "react-icons/ci";

export const adminLinks = [
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Statistics",
    path: "/dashboard/admin/home",
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
