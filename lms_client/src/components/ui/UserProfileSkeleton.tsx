import { Skeleton } from "@/components/ui/skeleton";

const UserProfileSkeleton = () => {
  return (
    <div className="UserProfileContainer w-full bg-gray-100">
      {/* Cover Photo Skeleton */}
      <Skeleton className="w-full h-48 sm:h-64 md:h-80 bg-gray-200" />

      <div className="container mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-32 relative z-10">
        <div className="flex flex-col items-center gap-4">
          {" "}
          {/* Changed to items-center */}
          {/* Profile Picture Skeleton */}
          <Skeleton className="size-32 sm:size-40 md:size-48 rounded-full border-4 border-white bg-gray-300 shadow-lg" />
          {/* Name Skeleton */}
          <Skeleton className="h-8 w-48 mt-4" /> {/* Removed sm:mt-0 sm:ml-4 */}
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg mt-8 space-y-4">
          {/* Email Skeleton */}
          <Skeleton className="h-5 w-64" />
          {/* Bio Skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          {/* Website Skeleton */}
          <Skeleton className="h-4 w-48" />
          {/* Joined On Skeleton */}
          <Skeleton className="h-5 w-56" />
          {/* Edit Profile Button Skeleton */}
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
