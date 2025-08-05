import { AdminStatCard } from "@/components/ui";
import {
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";

const AdminStatistics = () => {
  return (
    <main className=" pt-16 bg-gray-100 border border-gray-300 rounded-md shadow p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Dashboard Overview
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Total Courses" value="120" icon={BookOpen} />
        <AdminStatCard title="Total Students" value="15,432" icon={Users} />
        <AdminStatCard
          title="Active Instructors"
          value="55"
          icon={GraduationCap}
        />
        <AdminStatCard
          title="Revenue (Last 30 Days)"
          value="$12,345"
          icon={DollarSign}
        />
        <AdminStatCard
          title="Published Courses"
          value="98"
          icon={CheckCircle}
        />
        <AdminStatCard
          title="Average Course Completion"
          value="78%"
          icon={Clock}
        />
      </div>
    </main>
  );
};

export default AdminStatistics;
