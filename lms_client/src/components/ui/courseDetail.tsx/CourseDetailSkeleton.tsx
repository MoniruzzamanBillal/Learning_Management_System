import Wrapper from "@/components/shared/Wrapper";
import { Skeleton } from "../skeleton";

const CourseDetailSkeleton = () => {
  return (
    <div className="CourseDetailContainer bg-gray-50 min-h-screen">
      <div className="CourseDetailWrapper">
        {/* Top section */}
        <div className="courseTopSection py-8 bg-gray-200">
          <Wrapper className="courseNameTopSection flex justify-between gap-x-3">
            {/* Left section */}
            <div className="w-[70%] flex flex-col gap-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />

              <div>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </div>

              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>

            {/* Right section */}
            <div className="w-[30%] border border-gray-200 rounded bg-gray-50 shadow p-3 flex flex-col gap-y-3">
              <Skeleton className="h-48 w-full rounded" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Wrapper>
        </div>

        {/* About section */}
        <Wrapper className="mt-2">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-20 w-full" />
        </Wrapper>
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;
