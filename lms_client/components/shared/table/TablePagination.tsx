"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showItemCount?: boolean;
  siblingCount?: number;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showItemCount = true,
  siblingCount = 1,
}: TablePaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const generatePagination = () => {
    const delta = siblingCount;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const paginationRange = generatePagination();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-5",
        "border-t border-slate-200 dark:border-border",
        "bg-neutral-600 ",
        className,
      )}
    >
      {/* Items count */}
      {showItemCount && (
        <div className=" font-medium text-[0.875rem] leading-5.25 text-neutral-50  ">
          Showing {totalItems > 0 ? startIndex : 0} to {endIndex} of{" "}
          {totalItems} items
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2 ">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-1.5   size-8 rounded-[8px]  disabled:opacity-50 disabled:cursor-not-allowed transition-all border  border-table-border flex justify-center items-center cursor-pointer tablePaginationNumber tablePaginationGradientBorder  `}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} className=" text-white " />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-2  ">
          {paginationRange.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className=" size-8 p-1.5 flex items-center justify-center rounded-[8px]  bg-primary-50 text-white  tablePaginationNumber tablePaginationGradientBorder "
                >
                  ⋯
                </span>
              );
            }

            const pageNumber = page as number;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`  p-1.5 rounded-[8px] size-8 font-semibold text-[0.875rem] leading-5.25 flex justify-center items-center border ${currentPage === pageNumber ? " bg-primary-500 text-white border-primary-500 " : " text-neutral-50 tablePaginationNumber tablePaginationGradientBorder  border-table-border "} `}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-1.5   size-8 rounded-[8px]  disabled:opacity-50 disabled:cursor-not-allowed transition-all border  border-table-border flex justify-center items-center cursor-pointer tablePaginationNumber tablePaginationGradientBorder  `}
          aria-label="Next page"
        >
          <ChevronRight size={18} className=" text-white " />
        </button>
      </div>
    </div>
  );
}
