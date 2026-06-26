import { Award, BookOpen, Home, User } from "lucide-react";

export const UserLinks = [
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
    name: "My Courses",
    path: "/dashboard/user/my-courses",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "My Certificates",
    path: "/dashboard/user/certificates",
    icon: <Award className="w-5 h-5" />,
  },
];
