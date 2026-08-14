import { Skeleton } from "@/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Cover image */}
      <Skeleton className="h-44 w-full rounded-none bg-gray-200" />

      <div className="flex flex-col gap-2.5 p-4">
        {/* Course name */}
        <Skeleton className="h-5 w-3/4 bg-gray-200" />
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-5/6 bg-gray-200" />

        {/* Instructor + modules */}
        <Skeleton className="h-4 w-1/2 bg-gray-200" />
        <Skeleton className="h-4 w-1/3 bg-gray-200" />

        {/* Stars */}
        <Skeleton className="h-4 w-24 bg-gray-200" />

        {/* Price + CTA */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <Skeleton className="h-5 w-16 bg-gray-200" />
          <Skeleton className="h-8 w-28 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
