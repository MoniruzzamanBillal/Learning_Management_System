import { Skeleton } from "../../skeleton";

const ModuleItemSkeleton = () => {
  return (
    <div className="bg-muted p-4 my-5 rounded-md shadow">
      <div className="space-y-4">
        <Skeleton className="h-5  bg-gray-300" />
        <Skeleton className="h-5  bg-gray-300" />
        <Skeleton className="h-5  bg-gray-300" />
      </div>
    </div>
  );
};

export default ModuleItemSkeleton;
