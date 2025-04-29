/* eslint-disable @typescript-eslint/no-explicit-any */
import { flexRender } from "@tanstack/react-table";

export const renderModuleCell = (cellValue: any, cell: any) => {
  if (typeof cellValue === "string") {
    return cellValue;
  }

  if (Array.isArray(cellValue)) {
    if (cellValue.length < 1) {
      return (
        <p className="text-sm text-red-600 font-medium">
          No module added for this course
        </p>
      );
    } else {
      return (
        <ul className="list-disc pl-4">
          {cellValue.map((cellItem: any, index: number) => (
            <li key={index}>{cellItem?.title ?? "No module added !!!"}</li>
          ))}
        </ul>
      );
    }
  }

  return flexRender(cell.column.columnDef.cell, cell.getContext());

  //
};
