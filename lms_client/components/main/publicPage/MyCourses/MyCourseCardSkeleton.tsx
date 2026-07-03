import { Skeleton } from "@/components/ui/skeleton";

const MyCourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
      {/* Cover */}
      <Skeleton className="w-full sm:w-48 h-44 sm:h-auto shrink-0 rounded-none" />

      {/* Details */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 flex-1 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
};

export default MyCourseCardSkeleton;
