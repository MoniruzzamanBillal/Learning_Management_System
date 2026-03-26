import { Skeleton } from "../ui/skeleton";

const TableDataLoading = () => {
  const columns = Array(5).fill(null);
  const rows = Array(4).fill(null);

  return (
    <div className="rounded-md bg-gray-50 border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-5 border-b border-gray-300">
        {columns.map((_, index) => (
          <div key={index} className="p-3 text-center">
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Body */}
      {rows.map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 border-b border-gray-200 last:border-none"
        >
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="p-3">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableDataLoading;
