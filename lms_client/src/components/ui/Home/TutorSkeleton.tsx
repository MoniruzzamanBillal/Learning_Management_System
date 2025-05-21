import { Skeleton } from "../skeleton";

const TutorSkeleton = () => {
  return (
    <div className="instructorCard m-auto flex flex-col justify-center items-center">
      <Skeleton className="size-[5rem] rounded-full mb-2 bg-gray-300 " />
      <Skeleton className="h-4 w-24 mb-1 bg-gray-300" />
      <Skeleton className="h-4 w-32 bg-gray-300" />
    </div>
  );
};

export default TutorSkeleton;
