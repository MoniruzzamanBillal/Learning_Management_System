import { Skeleton } from "@/components/ui/skeleton";

const TutorSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center">
      <Skeleton className="size-20 rounded-full mb-3 bg-gray-200" />
      <Skeleton className="h-5 w-16 rounded-full mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-28 mb-1 bg-gray-200" />
      <Skeleton className="h-4 w-36 bg-gray-200" />
    </div>
  );
};

export default TutorSkeleton;
