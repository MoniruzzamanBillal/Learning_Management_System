import { Skeleton } from "../../skeleton";

const MyCourseCardSkeleton = () => {
  return (
    <div className="enrolledCourseCard">
      <div className="enrolledCourseCardWrapper w-[65%] rounded-md shadow bg-white border border-gray-200 flex justify-between gap-x-5">
        {/* Left course cover skeleton */}
        <div className="courseLeftCover w-[40%] h-[13rem] rounded-l-md overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Right details skeleton */}
        <div className="detailSection rightSection py-2 w-[60%] flex flex-col gap-y-4">
          <Skeleton className="h-7 w-[80%]" /> {/* Course name */}
          <Skeleton className="h-5 w-[50%]" /> {/* Platform name */}
          {/* Progress section */}
          <div className="courseProgressSection w-[90%] flex justify-center items-center gap-x-6">
            <Skeleton className="h-4 w-[60%] rounded-full" />{" "}
            {/* Progress bar */}
            <Skeleton className="h-5 w-10" /> {/* Progress percent */}
          </div>
          {/* Button skeleton */}
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default MyCourseCardSkeleton;
