import { Skeleton } from "../../skeleton";

const EnrolledCourseDetailSkeleton = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-5 flex justify-between gap-x-4">
        {/* Left Video Section */}
        <div className="w-[60%] bg-white border-gray-300 shadow-md ">
          <Skeleton className="h-[26rem] bg-gray-200 w-full rounded-md" />

          {/* Button Section */}
          <div className="py-3 flex justify-end gap-x-4 mr-3 ">
            <Skeleton className="h-10 bg-gray-200 w-24 rounded-md" />
            <Skeleton className="h-10 bg-gray-200 w-24 rounded-md" />
          </div>
        </div>

        {/* Right Module Section */}
        <div className="w-[40%] space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-md border shadow bg-white space-y-2"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseDetailSkeleton;
