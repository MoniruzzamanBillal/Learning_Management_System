import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const NoEnrollCourse = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No courses yet
      </h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        Explore our catalog and enroll in your first course to get started.
      </p>
      <Link href="/courses">
        <Button className="bg-prime-100 hover:bg-prime-200 text-white cursor-pointer">
          Browse Courses
        </Button>
      </Link>
    </div>
  );
};

export default NoEnrollCourse;
