import { Skeleton } from "../skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="CourseCardSkeletonContainer bg-gray-50 border border-gray-300 shadow rounded">
      <div className="CourseCardSkeletonWrapper flex flex-col gap-y-2">
        {/* Course Cover Skeleton */}
        <div className="h-[14rem] rounded-t overflow-hidden relative">
          <Skeleton className="w-full h-full bg-gray-200  " />
          <Skeleton className="absolute top-2 left-2 w-16 h-6 rounded bg-prime50" />
        </div>

        <div className="px-3 flex flex-col gap-y-2 py-2">
          {/* Course Name */}
          <Skeleton className="w-3/4 h-5 bg-gray-200 " />

          {/* Category */}
          <Skeleton className="w-1/2 h-4 bg-gray-200 " />

          {/* Instructors */}
          <Skeleton className="w-1/3 h-4 bg-gray-200 " />
          <Skeleton className="w-2/3 h-4 bg-gray-200 " />
          <Skeleton className="w-2/4 h-4 bg-gray-200 " />

          {/* Bottom Section */}
          <div className="flex justify-between items-center pt-3">
            <Skeleton className="w-20 h-5 bg-gray-200 " />
            <Skeleton className="w-24 h-9 rounded-md bg-gray-200 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
