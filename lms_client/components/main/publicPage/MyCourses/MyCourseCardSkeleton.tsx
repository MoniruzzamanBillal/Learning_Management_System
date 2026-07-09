import { Skeleton } from "@/components/ui/skeleton";

const MyCourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Cover */}
      <Skeleton className="h-48 w-full rounded-none bg-gray-200" />

      {/* Details */}
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-3/4 bg-gray-200" />
        <Skeleton className="h-3 w-24 bg-gray-200" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-3 flex-1 rounded-full bg-gray-200" />
          <Skeleton className="h-4 w-10 bg-gray-200" />
        </div>

        <div className="pt-3 border-t border-gray-100 mt-auto">
          <Skeleton className="h-8 w-28 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default MyCourseCardSkeleton;
