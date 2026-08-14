import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ClipboardList,
  Layers,
  Star,
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
    path: "/dashboard/admin/home",
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
  {
    name: "Error Logs",
    path: "/dashboard/admin/error-logs",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    name: "Manage Reviews",
    path: "/dashboard/admin/manage-reviews",
    icon: <Star className="w-5 h-5" />,
  },
];
