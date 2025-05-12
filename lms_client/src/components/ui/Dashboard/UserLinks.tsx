import { CiBookmark } from "react-icons/ci";

export const UserLinks = [
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
    name: "My Courses",
    path: "/dashboard/user/my-enrolled-courses",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "My Certificates",
    path: "/dashboard/user/course-certificates",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
];
