import { BookCheck, Home, Layers, User } from "lucide-react";

export const InstructorLinks = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Assigned Courses",
    path: "/dashboard/instructor/assign-courses",
    icon: <BookCheck className="w-5 h-5" />,
  },
  {
    name: "Manage Modules",
    path: "/dashboard/instructor/manage-module",
    icon: <Layers className="w-5 h-5" />,
  },
  // {
  //   name: "Manage Videos",
  //   path: "/dashboard/instructor/manage-video",
  //   icon: <Video className="w-5 h-5" />,
  // },
];
