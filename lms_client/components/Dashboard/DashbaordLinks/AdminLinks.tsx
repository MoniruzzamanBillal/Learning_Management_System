import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Layers,
  User,
  Users,
} from "lucide-react";

export const adminLinks = [
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Statistics",
    path: "/dashboard/admin/stat",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    name: "Manage Instructors",
    path: "/dashboard/admin/manage-instructor",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Manage Courses",
    path: "/dashboard/admin/manage-course",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Manage Modules",
    path: "/dashboard/admin/manage-modules",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    name: "Enrollment",
    path: "/dashboard/admin/enroll-courses",
    icon: <ClipboardList className="w-5 h-5" />,
  },
];
