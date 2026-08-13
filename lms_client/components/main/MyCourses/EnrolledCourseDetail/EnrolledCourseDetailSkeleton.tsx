import Wrapper from "@/components/shared/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";

const EnrolledCourseDetailSkeleton = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Wrapper className="py-8">
        {/* Header skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="w-full sm:w-64 flex items-center gap-3">
              <Skeleton className="h-3 flex-1 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Left video section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <Skeleton className="h-[26rem] bg-gray-200 w-full rounded-xl" />
          </div>

          {/* Right module section */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg border border-gray-100 p-3 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default EnrolledCourseDetailSkeleton;
