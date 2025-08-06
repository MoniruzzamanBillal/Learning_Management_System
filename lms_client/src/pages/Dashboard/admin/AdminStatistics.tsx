import { AdminStatCard, AdminStatCardSkeleton } from "@/components/ui";
import { useGetAdminStatsQuery } from "@/redux/features/course/course.api";
import {
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";

const AdminStatistics = () => {
  const { data: statsData, isLoading } = useGetAdminStatsQuery(undefined);

  // console.log(statsData?.data);

  return (
    <main className=" pt-16 bg-gray-100 border border-gray-300 rounded-md shadow p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Dashboard Overview
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 6 })?.map((_, ind) => (
            <AdminStatCardSkeleton key={ind} />
          ))}
      </div>

      {statsData?.data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            title="Total Courses"
            value={statsData?.data?.totalCourses}
            icon={BookOpen}
          />
          <AdminStatCard
            title="Total Students"
            value={statsData?.data?.totalStudents}
            icon={Users}
          />
          <AdminStatCard
            title="Active Instructors"
            value={statsData?.data?.totalInstructors}
            icon={GraduationCap}
          />
          <AdminStatCard
            title="Revenue (Last 30 Days)"
            value={statsData?.data?.revenue}
            icon={DollarSign}
          />
          <AdminStatCard
            title="Published Courses"
            value={statsData?.data?.publishedCourses}
            icon={CheckCircle}
          />
          <AdminStatCard
            title="Average Course Completion"
            value="78%"
            icon={Clock}
          />
        </div>
      )}
    </main>
  );
};

export default AdminStatistics;
