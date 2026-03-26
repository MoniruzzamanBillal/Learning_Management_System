"use client";

import { flexRender, Table as TanStackTable } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { TablePagination } from "./TablePagination";

type TableContentProps<TData> = {
  table: TanStackTable<TData>;
  showSerialNumber?: boolean;
};

export default function TableContent<TData>({
  table,
  showSerialNumber = true,
}: TableContentProps<TData>) {
  return (
    <div className="  border border-prime-50 bg-prime-50/5 rounded-[8px] overflow-hidden  ">
      <div className=" w-full overflow-x-auto">
        <table className="min-w-max w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className=" bg-prime-50/20 ">
                {showSerialNumber && (
                  <th className=" px-4 py-3 first:flex first:items-center last:flex last:justify-center last:rounded-r-2xl">
                    <div>
                      <div className="flex items-center justify-start  ">
                        <span className=" font-semibold text-[0.875rem] leading-5.25 text-gray-900 ">
                          SL. No.
                        </span>
                      </div>
                    </div>
                  </th>
                )}

                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className=" px-5 py-4 last:flex last:justify-center"
                  >
                    <div
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={` font-semibold text-[0.875rem] text-gray-900  flex items-center justify-between 
    ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}
  `}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.getCanSort() && (
                        <span>
                          {{
                            asc: <ChevronUp className=" size-5  " />,
                            desc: <ChevronDown className=" size-5  " />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDown className=" size-5  " />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={100} className="p-10 text-center text-lg">
                  No Data Available
                </td>
              </tr>
            ) : (
              <>
                {table.getRowModel().rows.map((row, index: number) => (
                  <tr
                    key={row.id}
                    className={`cursor-pointer border-b border-b-prime-50  transition-colors last:border-0  h-20 `}
                  >
                    {showSerialNumber && (
                      <td className="  py-4 px-5 font-medium text-[0.875rem] text-gray-800 ">
                        {String(
                          table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            index +
                            1,
                        ).padStart(2, "0")}
                      </td>
                    )}

                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="  py-4 px-5 font-medium text-[0.875rem] text-gray-800 "
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {/*  */}
      </div>

      {/* pagination */}

      {table?.getFilteredRowModel()?.rows?.length > 10 && (
        <TablePagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          totalItems={table.getFilteredRowModel().rows.length}
          itemsPerPage={table.getState().pagination.pageSize}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      )}
      {/*  */}
    </div>
  );
}
