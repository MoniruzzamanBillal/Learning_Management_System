import { Skeleton } from "@/components/ui/skeleton";

const UserProfileSkeleton = () => {
  return (
    <div className="UserProfileContainer">
      <div className="UserProfileWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <div className="profileImgWrapper flex flex-col xsm:flex-row justify-between items-center gap-y-8">
          {/* Left Section */}
          <div className="profileLeftSection flex items-center gap-x-5">
            {/* Image Skeleton */}
            <div className="imgSection rounded-full overflow-hidden size-[9rem]">
              <Skeleton className="w-full h-full rounded-full bg-gray-300 " />
            </div>

            {/* Name & Email Skeleton */}
            <div className="nameSection">
              <div className="nameTopSection flex items-center gap-x-2 mb-2">
                <Skeleton className="h-6 w-[150px] bg-gray-300 " />
              </div>
              <Skeleton className="h-4 w-[200px] bg-gray-300 " />
            </div>
          </div>

          {/* Edit Button Skeleton */}
          <div className="profileRightSection">
            <Skeleton className="h-10 w-[120px] bg-gray-300 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
